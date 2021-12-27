import { Middleware } from "@decorators/express";
import { Request, Response, NextFunction } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import * as ErrorConstants from "../constants/error.constant";

export class EnsureAuthenticated implements Middleware {
    use(
        request: Request<
            ParamsDictionary,
            any,
            any,
            ParsedQs,
            Record<string, any>
        >,
        _: Response<any, Record<string, any>>,
        next: NextFunction
    ): void {
        if (request.isUnauthenticated())
            return next({
                status: 401,
                message: ErrorConstants.AUTH_401_MESSAGE,
                error: { route: request.path }
            });
        return next();
    }
}
