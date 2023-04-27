import { Middleware } from "@decorators/express";
import { plainToInstance } from "class-transformer";
import { validate, validateOrReject } from "class-validator";
import { Request, Response, NextFunction } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import * as ErrorConstants from "@constants/error.constant";

export function Validator(model: any): any {
    class ValidatorMiddleware implements Middleware {
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
        ): Promise<void> {
            await validateOrReject(
                plainToInstance(model, request.body),
                request.method === "PATCH"
                    ? { skipMissingProperties: true }
                    : {}
            )
                .then(() => next())
                .catch((errors) => {
                    response.status(422).send({
                        message: ErrorConstants.VALIDATION_422_MESSAGE,
                        errors: errors.flatMap((error: any) =>
                            Object.values(error["constraints"])
                        )
                    });
                });
        }
    }
    return new ValidatorMiddleware();
}
