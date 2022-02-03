import { Middleware } from "@decorators/express";
import { Request, Response, NextFunction } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import * as ErrorConstants from "@constants/error.constant";

export class EnsureAuthenticated implements Middleware {
    use(
        request: Request<
            ParamsDictionary,
            any,
            any,
            ParsedQs,
            Record<string, any>
        >,
        response: Response<any, Record<string, any>>,
        next: NextFunction
    ): void {
        if (request.isUnauthenticated())
            response.status(401).send({
                message: ErrorConstants.AUTH_401_MESSAGE,
                error: { route: request.path }
            });
        return next();
    }
}
