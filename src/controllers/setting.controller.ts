import {
    Body,
    Controller,
    Get,
    Params,
    Patch,
    Post,
    Response
} from "@decorators/express";
import { Response as ExpressResponse } from "express";
import * as SuccessConstants from "@constants/success.constant";
import * as ErrorConstants from "@constants/error.constant";
import { SettingService } from "@app/services/setting.service";
import { autoInjectable } from "tsyringe";
import { EnsureAuthenticated } from "@app/middlewares/authenticated.middleware";
import { EnsureAuthorization } from "@app/middlewares/authorization.middleware";
import { AuthorizationLevel } from "@app/constants/authorization-level.constant";
import { Setting } from "@app/models/setting.model";
import { Validator } from "@app/middlewares/validator.middleware";

@autoInjectable()
@Controller("/settings")
export class SettingController {
    constructor(private readonly settingService: SettingService) {}

    @Get("/")
    async getAll(@Response() response: ExpressResponse) {
        response.status(200).send({
            message: SuccessConstants.SETTINGS_GET,
            data: await this.settingService.find()
        });
    }

    @Get("/:key")
    async getByKey(
        @Response() response: ExpressResponse,
        @Params("key") key: string
    ) {
        response.status(200).send({
            message: SuccessConstants.SETTINGS_GET,
            data: await this.settingService.findByKey(key)
        });
    }

    @Post("/", [
        EnsureAuthenticated,
        EnsureAuthorization([AuthorizationLevel.Staff]),
        Validator(Setting)
    ])
    async create(
        @Response() response: ExpressResponse,
        @Body() setting: Setting
    ) {
        const result: Setting = await this.settingService.save(setting);

        return result
            ? response.status(200).send({
                  message: SuccessConstants.SETTINGS_POST,
                  data: result
              })
            : response.status(422).send({
                  message: ErrorConstants.SETTINGS_422_MESSAGE
              });
    }

    @Patch("", [
        EnsureAuthenticated,
        EnsureAuthorization([AuthorizationLevel.Staff])
    ])
    async update(
        @Response() response: ExpressResponse,
        @Body() settings: { [setting: string]: string | number | boolean }
    ) {
        await this.settingService.update(settings);
        return response.status(200).json({
            message: SuccessConstants.SETTINGS_PATCH
        });
    }

    @Patch("/:identifier", [
        EnsureAuthenticated,
        EnsureAuthorization([AuthorizationLevel.Staff]),
        Validator(Setting)
    ])
    async updateOne(
        @Response() response: ExpressResponse,
        @Params("identifier") identifier: number,
        @Body() setting: Partial<Setting>
    ) {
        const result = await this.settingService.updateOne(identifier, setting);

        return result
            ? response.status(200).json({
                  message: SuccessConstants.SETTINGS_PATCH,
                  data: result
              })
            : response.status(404).json({
                  message: ErrorConstants.SETTINGS_404_MESSAGE,
                  data: {
                      identifier: identifier
                  }
              });
    }
}
