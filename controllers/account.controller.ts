import { Response as ExpressResponse } from "express";
import { autoInjectable } from "tsyringe";
import { AccountService } from "../services/account.service";
import * as SuccessConstants from "../constants/success.constant";
import * as ErrorConstants from "../constants/error.constant";
import {
    Body,
    Controller,
    Get,
    Params,
    Patch,
    Post,
    Response
} from "@decorators/express";
import Account from "../models/account.model";
import { EnsureAuthenticated } from "../middlewares/authenticated.middleware";
import { EnsureAuthorization } from "../middlewares/authorization.middleware";
import { AuthorizationLevel } from "../constants/authorization-level.constant";

@autoInjectable()
@Controller("/account")
export class AccountController {
    constructor(private readonly accountService: AccountService) {}

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

    @Post("/")
    async create(
        @Response() response: ExpressResponse,
        @Body() account: Account
    ) {
        const result: Account = await this.accountService.save(account);

        return result
            ? response.status(200).json({
                  message: SuccessConstants.ACCOUNT_CREATE,
                  data: result
              })
            : response.status(422).json({
                  message: ErrorConstants.ACCOUNT_DUPLICATE_422_MESSAGE
              });
    }

    // (Add middleware for sendConfirmAccountEmail and update database confirmed: false, email: newEmail)
    @Patch("/:identifier", [
        EnsureAuthenticated,
        EnsureAuthorization([
            AuthorizationLevel.Staff,
            AuthorizationLevel.Account
        ])
    ])
    async update(
        @Response() response: ExpressResponse,
        @Params("identifier") identifier: number,
        @Body() update: Partial<Account>
    ) {
        //TODO - Implement resend e-mail confirmation and verification.
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

    //TODO - Implement (gotInvites, invitedAccount)
}
