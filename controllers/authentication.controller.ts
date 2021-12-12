import { Controller, Post, Request, Response } from "@decorators/express";
import { autoInjectable } from "tsyringe";
import {
    Request as ExpressRequest,
    Response as ExpressResponse
} from "express";
import { EmailAndPasswordStrategy } from "../strategy/emailAndPassword.strategy";
import passport from "passport";
import Account from "../models/account.model";
import * as ErrorConstants from "../constants/error.constant";
import * as SuccessConstants from "../constants/success.constant";

@autoInjectable()
@Controller("/authentication")
export class AuthenticationController {
    constructor(private readonly strategy: EmailAndPasswordStrategy) {}

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
}
