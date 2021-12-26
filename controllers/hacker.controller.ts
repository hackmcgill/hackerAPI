import {
    Body,
    Controller,
    Get,
    Params,
    Patch,
    Post,
    Response
} from "@decorators/express";
import { autoInjectable } from "tsyringe";
import { AuthorizationLevel } from "../constants/authorization-level.constant";
import { EnsureAuthenticated } from "../middlewares/authenticated.middleware";
import { EnsureAuthorization } from "../middlewares/authorization.middleware";
import Hacker from "../models/hacker.model";
import { HackerService } from "../services/hacker.service";
import * as SuccessConstants from "../constants/success.constant";
import * as ErrorConstants from "../constants/error.constant";
import { request, Response as ExpressResponse } from "express";

@autoInjectable()
@Controller("/hacker")
export class HackerController {
    constructor(private readonly hackerService: HackerService) {}

    @Get("/:identifier", [
        EnsureAuthenticated,
        EnsureAuthorization([
            AuthorizationLevel.Staff,
            AuthorizationLevel.Hacker
        ])
    ])
    async getByIdentifier(
        @Response() response: ExpressResponse,
        @Params("identifier") identifier: number
    ) {
        const hacker:
            | Hacker
            | undefined = await this.hackerService.findByIdentifier(identifier);

        return hacker
            ? response.status(200).json({
                  message: SuccessConstants.HACKER_READ,
                  data: hacker
              })
            : response.status(404).json({
                  message: ErrorConstants.HACKER_404_MESSAGE
              });
    }

    @Post("/", [EnsureAuthenticated])
    async create(
        @Response() response: ExpressResponse,
        @Body() hacker: Hacker
    ) {
        //TODO - Check if applications are open when hacker is created.
        const result: Hacker = await this.hackerService.save(hacker);

        return result
            ? response.status(200).send({
                  message: SuccessConstants.HACKER_CREATE,
                  data: result
              })
            : response.status(422).send({
                  message: ErrorConstants.ACCOUNT_DUPLICATE_422_MESSAGE
              });
    }

    @Patch("/:identifier", [
        EnsureAuthenticated,
        EnsureAuthorization([
            AuthorizationLevel.Staff,
            AuthorizationLevel.Hacker
        ])
    ])
    async update(
        @Response() response: ExpressResponse,
        @Params("identifier") identifier: number,
        @Body() update: Partial<Hacker>
    ) {
        const result = await this.hackerService.update(identifier, update);

        return result
            ? response.status(200).json({
                  message: SuccessConstants.HACKER_UPDATE,
                  data: result
              })
            : response.status(404).json({
                  message: ErrorConstants.HACKER_404_MESSAGE,
                  data: {
                      identifier: identifier
                  }
              });
    }
}
