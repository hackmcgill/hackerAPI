import {
    Request as ExpressRequest,
    Response as ExpressResponse
} from "express";
import { autoInjectable } from "tsyringe";
import { AccountService } from "@services/account.service";
import * as SuccessConstants from "@constants/success.constant";
import * as ErrorConstants from "@constants/error.constant";
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
import Account from "@models/account.model";
import { EnsureAuthenticated } from "@middlewares/authenticated.middleware";
import { EnsureAuthorization } from "@middlewares/authorization.middleware";
import { AuthorizationLevel } from "@constants/authorization-level.constant";
import { AccountConfirmationService } from "@services/account-confirmation.service";
import { EmailService } from "@services/email.service";
import * as GeneralConstants from "@constants/general.constant";
import { join } from "path";
import { Validator } from "@middlewares/validator.middleware";
import AccountConfirmation from "@models/account-confirmation-token.model";
import * as jwt from "jsonwebtoken";

@autoInjectable()
@Controller("/account")
export class AccountController {
    constructor(
        private readonly accountService: AccountService,
        private readonly accountConfirmationService: AccountConfirmationService,
        private readonly mailer: EmailService
    ) {}

    @Get("/", [
        EnsureAuthenticated,
        EnsureAuthorization([
            AuthorizationLevel.Staff,
            AuthorizationLevel.Account
        ])
    ])
    async getByEmail(
        @Response() response: ExpressResponse,
        @Body("email") email: string
    ) {
        const account = await this.accountService.findByEmail(email);

        return account
            ? response.status(200).json({
                  message: SuccessConstants.ACCOUNT_READ,
                  data: account
              })
            : response.status(404).json({
                  message: ErrorConstants.ACCOUNT_404_MESSAGE
              });
    }

    @Get("/self", [
        EnsureAuthenticated,
        EnsureAuthorization([
            AuthorizationLevel.Staff,
            AuthorizationLevel.Account
        ])
    ])
    async getSelf(
        @Request() request: ExpressRequest,
        @Response() response: ExpressResponse
    ) {
        const account:
            | Account
            | undefined = await this.accountService.findByIdentifier(
            //@ts-ignore
            request.user?.identifier
        );

        return account
            ? response.status(200).json({
                  message: SuccessConstants.ACCOUNT_READ,
                  data: account
              })
            : response.status(404).json({
                  message: ErrorConstants.ACCOUNT_404_MESSAGE
              });
    }

    @Get("/:identifier", [
        EnsureAuthenticated,
        EnsureAuthorization([
            AuthorizationLevel.Staff,
            AuthorizationLevel.Account
        ])
    ])
    async getByIdentifier(
        @Response() response: ExpressResponse,
        @Params("identifier") identifier: number
    ) {
        const account:
            | Account
            | undefined = await this.accountService.findByIdentifier(
            identifier
        );

        return account
            ? response.status(200).json({
                  message: SuccessConstants.ACCOUNT_READ,
                  data: account
              })
            : response.status(404).json({
                  message: ErrorConstants.ACCOUNT_404_MESSAGE
              });
    }

    @Post("/", [Validator(Account)])
    async create(
        @Response() response: ExpressResponse,
        @Body() account: Account,
        @Headers("X-Invite-Token") token?: string
    ) {
        if (token) {
            const data = jwt.verify(
                token,
                process.env.JWT_CONFIRM_ACC_SECRET!
            ) as {
                identifier: number;
            };

            const result = await this.accountConfirmationService.findByIdentifier(
                data.identifier
            );

            if (result) {
                account.confirmed = true;
                account.accountType = result.accountType;

                this.accountConfirmationService.delete(result.identifier);
            }
        }

        const result: Account = await this.accountService.save(account);

        if (result) {
            const model = await this.accountConfirmationService.save({
                accountType: GeneralConstants.HACKER,
                email: result.email,
                confirmationType: GeneralConstants.CONFIRMATION_TYPE_ORGANIC,
                account: result
            });

            await this.mailer.send(
                {
                    to: model.email,
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
                            model.identifier,
                            model.account!.identifier
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
        }

        return response.status(200).send({
            message: SuccessConstants.ACCOUNT_CREATE,
            data: result
        });
    }

    // (Add middleware for sendConfirmAccountEmail and update database confirmed: false, email: newEmail)
    @Patch("/:identifier", [
        EnsureAuthenticated,
        EnsureAuthorization([
            AuthorizationLevel.Staff,
            AuthorizationLevel.Account
        ]),
        Validator(Account)
    ])
    async update(
        @Response() response: ExpressResponse,
        @Params("identifier") identifier: number,
        @Body() update: Partial<Account>
    ) {
        //TODO - Implement resend e-mail confirmation and verification.
        //TODO - A thrifty user can update their password from here and it would not be hashed, we should attempt to block.
        const result = await this.accountService.update(identifier, update);

        return result
            ? response.status(200).json({
                  message: SuccessConstants.ACCOUNT_UPDATE,
                  data: result
              })
            : response.status(404).json({
                  message: ErrorConstants.ACCOUNT_404_MESSAGE,
                  data: {
                      identifier: identifier
                  }
              });
    }

    @Post("/invite", [
        EnsureAuthenticated,
        EnsureAuthorization([AuthorizationLevel.Staff])
    ])
    async createWithInvite(
        @Response() response: ExpressResponse,
        @Body("email") email: string,
        @Body("accountType") accountType: string
    ) {
        const model = await this.accountConfirmationService.save({
            email: email,
            accountType: accountType
        });

        await this.mailer.send(
            {
                to: model.email,
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
                        model.identifier,
                        model.account!.identifier
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

        return response.status(200).send({
            message: SuccessConstants.ACCOUNT_INVITE,
            data: {}
        });
    }

    @Get("/invites", [
        EnsureAuthenticated,
        EnsureAuthorization([AuthorizationLevel.Staff])
    ])
    async getInvited(@Response() response: ExpressResponse) {
        const result: Array<AccountConfirmation> = await this.accountConfirmationService.find();

        response.status(200).json({
            message: SuccessConstants.ACCOUNT_READ,
            data: result
        });
    }
}
