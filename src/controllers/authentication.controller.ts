import {
    Body,
    Controller,
    Get,
    Headers,
    Params,
    Patch,
    Post,
    Request,
    Response
} from "@decorators/express";
import { autoInjectable } from "tsyringe";
import {
    Request as ExpressRequest,
    Response as ExpressResponse
} from "express";
import { EmailAndPasswordStrategy } from "@strategies/email-and-password.strategy";
import passport from "passport";
import Account from "@models/account.model";
import * as ErrorConstants from "@constants/error.constant";
import * as SuccessConstants from "@constants/success.constant";
import { EnsureAuthenticated } from "@middlewares/authenticated.middleware";
import { PasswordResetService } from "@services/password-reset.service";
import { AccountService } from "@services/account.service";
import PasswordReset from "@models/password-reset-token.model";
import { EmailService } from "@services/email.service";
import { join } from "path";
import jwt from "jsonwebtoken";
import { AccountConfirmationService } from "@services/account-confirmation.service";
import AccountConfirmation from "@models/account-confirmation-token.model";
import { EnsureAuthorization } from "@middlewares/authorization.middleware";
import { AuthorizationLevel } from "@constants/authorization-level.constant";

@autoInjectable()
@Controller("/authentication")
export class AuthenticationController {
    constructor(
        private readonly strategy: EmailAndPasswordStrategy,
        private readonly accountService: AccountService,
        private readonly passwordResetService: PasswordResetService,
        private readonly accountConfirmationService: AccountConfirmationService,
        private readonly mailer: EmailService
    ) {}

    @Post("/sign-in")
    async signIn(
        @Request() request: ExpressRequest,
        @Response() response: ExpressResponse
    ) {
        passport.authenticate(this.strategy, (error: any, user: Account) => {
            if (error)
                return response.status(500).json({
                    message: ErrorConstants.GENERIC_500_MESSAGE,
                    error: error
                });

            if (!user)
                return response.status(401).json({
                    message: ErrorConstants.AUTH_401_MESSAGE,
                    error: {}
                });

            request.login(user, (error) => {
                if (error)
                    return response.status(500).json({
                        message: ErrorConstants.LOGIN_500_MESSAGE,
                        error: {}
                    });

                return response.status(200).json({
                    message: SuccessConstants.AUTH_LOGIN,
                    data: {}
                });
            });
        })(request, response);
    }

    @Get("/sign-out", [EnsureAuthenticated])
    signOut(
        @Request() request: ExpressRequest,
        @Response() response: ExpressResponse
    ) {
        request.logout();

        return response.status(200).json({
            message: SuccessConstants.AUTH_LOGOUT,
            data: {}
        });
    }

    @Post("/password/forgot")
    async forgotPassword(
        @Response() response: ExpressResponse,
        @Body("email") email: string
    ) {
        const account:
            | Account
            | undefined = await this.accountService.findByEmail(email);

        if (account) {
            const model: PasswordReset = await this.passwordResetService.save(
                account
            );
            await this.mailer.send(
                {
                    to: email,
                    subject: "Password Reset Instructions",
                    html: join(__dirname, "../assets/email/ResetPassword.mjml")
                },
                {
                    link: this.passwordResetService.generateLink(
                        "password/forgot",
                        this.passwordResetService.generateToken(
                            model.identifier,
                            model.account.identifier
                        )
                    )
                },
                (error?: any) => {
                    if (error)
                        response.status(500).send({
                            message: ErrorConstants.EMAIL_500_MESSAGE,
                            data: error
                        });
                    else
                        response.status(200).send({
                            message: SuccessConstants.AUTH_SEND_RESET_EMAIL,
                            data: {}
                        });
                }
            );
        }
    }

    @Post("/password/reset")
    async resetPassword(
        @Response() response: ExpressResponse,
        @Body("X-Reset-Token") token: string,
        @Body("password") password: string
    ) {
        // Check if the JWT is valid and provide deconstructed object of identifier and account identiifer.
        const data = jwt.verify(token, process.env.JWT_RESET_PWD_SECRET!) as {
            identifier: number;
        };

        const model = await this.passwordResetService.findByIdentifier(
            data.identifier
        );

        if (model) {
            await this.accountService.updatePassword(
                model.account.identifier,
                password
            );
            await this.passwordResetService.delete(model.identifier);

            response.status(200).send({
                message: SuccessConstants.AUTH_RESET_PASSWORD,
                data: {}
            });
        } else {
            // Either the token was already used, it's invalid, or user does not exist.
            response.status(401).send({
                message: ErrorConstants.ACCOUNT_TOKEN_401_MESSAGE,
                error: {}
            });
        }
    }

    @Patch("/password/change", [
        EnsureAuthenticated,
        EnsureAuthorization([AuthorizationLevel.Account])
    ])
    async changePassword(
        @Request() request: ExpressRequest,
        @Response() response: ExpressResponse,
        @Body("oldPassword") oldPassword: string,
        @Body("newPassword") newPassword: string
    ) {
        const account = await this.accountService.getAccountIfValid(
            //@ts-ignore
            request.user?.email,
            oldPassword
        );

        // If the user's old password is correct.
        if (account) {
            await this.accountService.updatePassword(
                account.identifier,
                newPassword
            );
            response.status(200).send({
                message: SuccessConstants.AUTH_RESET_PASSWORD,
                data: {}
            });
        }
        response.status(401).send({
            message: ErrorConstants.AUTH_401_MESSAGE
        });
    }

    @Get("/confirm/resend", [EnsureAuthenticated])
    async resendAccountConfirmation(
        @Request() request: ExpressRequest,
        @Response() response: ExpressResponse
    ) {
        // We use the non-null asseration opearator as we are sure that the user exists befure of the EnsureAuthenticated middleware.
        const account:
            | Account
            | undefined = await this.accountService.findByIdentifier(
            //@ts-ignore
            request.user?.identifier
        );

        if (account!.confirmed)
            response.status(422).send({
                message: "Account already confirmed"
            });

        const model:
            | AccountConfirmation
            | undefined = await this.accountConfirmationService.findByAccount(
            account!.identifier
        );

        if (!model)
            response.status(428).send({
                message: "Account confirmation token does not exist"
            });

        await this.mailer.send(
            {
                to: account?.email,
                subject: "Account Confirmation Instructions",
                html: join(
                    __dirname,
                    "../assets/email/AccountConfirmation.mjml"
                )
            },
            {
                link: this.accountConfirmationService.generateLink(
                    "confirm",
                    this.accountConfirmationService.generateToken(
                        model!.identifier,
                        account!.identifier
                    )
                )
            },
            (error?: any) => {
                if (error)
                    response.status(500).send({
                        message: ErrorConstants.EMAIL_500_MESSAGE,
                        data: error
                    });
            }
        );

        response.status(200).send({
            message: SuccessConstants.AUTH_SEND_CONFIRMATION_EMAIL,
            data: {}
        });
    }

    @Post("/confirm/:token")
    async confirmAccount(
        @Response() response: ExpressResponse,
        @Params("token") token: string
    ) {
        // Check if the JWT is valid and provide deconstructed object of identifier and account identiifer.
        const data = jwt.verify(token, process.env.JWT_CONFIRM_ACC_SECRET!) as {
            identifier: number;
            account: number;
        };

        const model = await this.accountConfirmationService.findByIdentifier(
            data.identifier
        );

        if (model) {
            // TODO - Check this to ensure no security vuln - Could the JWT Token be modified in some way.
            // A better approach might be storing a digest (hash) of a randomly generated token using crypto.
            await this.accountService.update(data.account, {
                confirmed: true
            });
            await this.accountConfirmationService.delete(model.identifier);

            response.status(200).send({
                message: SuccessConstants.AUTH_CONFIRM_ACCOUNT,
                data: {}
            });
        } else {
            // Either the token was already used, it's invalid, or user does not exist.
            response.status(401).send({
                message: ErrorConstants.ACCOUNT_TOKEN_401_MESSAGE,
                error: {}
            });
        }
    }
}
