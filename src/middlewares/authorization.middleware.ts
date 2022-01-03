import { Middleware } from "@decorators/express";
import { Request, Response, NextFunction } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import { container, delay, inject, injectable } from "tsyringe";
import * as ErrorConstants from "@constants/error.constant";
import { AuthorizationLevel } from "@constants/authorization-level.constant";
import Account from "@models/account.model";
import { AccountService } from "@services/account.service";

// TODO - Improve the logic of the middleware to reduce duplication of response.
// TODO - Provide proper comments / documentation.
// TODO - Find a better way to pass parameters rather than encapsulating middleware class.
// Current solution found from https://github.com/serhiisol/node-decorators/issues/111
// Library Author Suggest's Dependency Injection.
export function EnsureAuthorization(
    roles: Array<AuthorizationLevel>,
    noIdentifierCheck?: boolean
): any {
    @injectable()
    class EnsureAuthorizationClass implements Middleware {
        constructor(
            @inject(delay(() => AccountService))
            private readonly accountService: AccountService
        ) {}

        async use(
            request: Request<
                ParamsDictionary,
                any,
                any,
                ParsedQs,
                Record<string, any>
            >,
            response: Response<any, Record<string, any>>,
            next: NextFunction
        ) {
            if (
                roles.includes(AuthorizationLevel.None) ||
                //@ts-ignore
                request.user?.accountType ===
                    AuthorizationLevel.Staff.toString()
            )
                return next();

            if (
                !roles.includes(AuthorizationLevel.Account) &&
                //@ts-ignore
                !roles.includes(request.user?.accountType)
            )
                return response.status(403).json({
                    message: ErrorConstants.AUTH_403_MESSAGE,
                    error: { route: request.originalUrl }
                });

            if (request.params["identifier"]) {
                const query:
                    | Account
                    | undefined = await this.accountService.findByIdentifier(
                    parseInt(request.params["identifier"])
                );
                if (
                    !noIdentifierCheck &&
                    //@ts-ignore
                    query?.identifier !== request.user?.identifier
                )
                    return response.status(403).json({
                        message: ErrorConstants.AUTH_403_MESSAGE,
                        error: { route: request.originalUrl }
                    });
            }

            if (request.params["email"] != null) {
                const query:
                    | Account
                    | undefined = await this.accountService.findByEmail(
                    request.params["email"]
                );
                //@ts-ignore
                if (query?.email !== request.user?.email)
                    return response.status(403).json({
                        message: ErrorConstants.AUTH_403_MESSAGE,
                        error: { route: request.originalUrl }
                    });
            }
            return next();
        }
    }
    return container.resolve(EnsureAuthorizationClass);
}
