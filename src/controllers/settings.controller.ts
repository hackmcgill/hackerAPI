import { Controller, Get, Response } from "@decorators/express";
import { Response as ExpressResponse } from "express";
import * as SuccessConstants from "@constants/success.constant";

@Controller("/settings")
export class SettingsController {
    @Get("/")
    getAll(@Response() response: ExpressResponse) {
        response.status(200).send({
            message: SuccessConstants.SETTINGS_GET,
            data: {
                openTime: Date.now().toString(),
                closeTime: (Date.now() + 31540000000 + 2628000000).toString(),
                confirmTime: (
                    Date.now() +
                    31540000000 +
                    2628000000 +
                    2628000000
                ).toString(),
                isRemote: false
            }
        });
    }
}
