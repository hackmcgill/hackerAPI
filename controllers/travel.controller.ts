import {
    Controller,
    Get,
    Params,
    Patch,
    Post,
    Request,
    Response
} from "@decorators/express";
import { autoInjectable } from "tsyringe";
import { AuthorizationLevel } from "../constants/authorization-level.constant";
import { EnsureAuthenticated } from "../middlewares/authenticated.middleware";
import { EnsureAuthorization } from "../middlewares/authorization.middleware";
import Travel from "../models/travel.model";
import { TravelService } from "../services/travel.service";
import {
    Request as ExpressRequest,
    Response as ExpressResponse
} from "express";
import * as SuccessConstants from "../constants/success.constant";
import * as ErrorConstants from "../constants/error.constant";

@autoInjectable()
@Controller("/travel")
export class TravelController {
    constructor(private readonly travelService: TravelService) {}

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
        const travel:
            | Travel
            | undefined = await this.travelService.findByIdentifier(identifier);

        return travel
            ? response.status(200).json({
                  message: SuccessConstants.TRAVEL_READ,
                  data: travel
              })
            : response.status(404).json({
                  message: ErrorConstants.TRAVEL_404_MESSAGE
              });
    }

    @Post("/", [
        EnsureAuthenticated,
        EnsureAuthorization([
            AuthorizationLevel.Staff,
            AuthorizationLevel.Hacker
        ])
    ])
    async create(
        @Response() response: ExpressResponse,
        travel: Omit<Travel, "status" | "offer">
    ) {
        // TODO - Find a more elegant way to set the default values.
        // We remove the user values as we don't want a hacker setting their own offer as accepted or setting a offer amount.
        const result = await this.travelService.save({
            offer: 0,
            status: "None",
            ...travel
        });

        return result
            ? response.status(200).send({
                  message: SuccessConstants.TRAVEL_CREATE,
                  data: result
              })
            : response.status(422).send({
                  //TODO - Create duplicate message.
                  message: ErrorConstants.TRAVEL_CREATE_500_MESSAGE
              });
    }

    @Patch("/:identifier", [
        EnsureAuthenticated,
        EnsureAuthorization([AuthorizationLevel.Staff])
    ])
    async updateByStaff(
        @Response() response: ExpressResponse,
        @Params("identifier") identifier: number,
        travel: Partial<Travel>
    ) {
        const result = await this.travelService.update(identifier, travel);

        return result
            ? response.status(200).send({
                  message: SuccessConstants.TRAVEL_UPDATE,
                  data: result
              })
            : response.status(404).send({
                  message: ErrorConstants.TRAVEL_404_MESSAGE,
                  data: {
                      identifier: identifier
                  }
              });
    }

    @Patch("/", [
        EnsureAuthenticated,
        EnsureAuthorization([AuthorizationLevel.Hacker])
    ])
    async update(
        @Request() request: ExpressRequest,
        @Response() response: ExpressResponse,
        travel: Omit<Travel, "status" | "offer">
    ) {
        // We remove the user values as we don't want a hacker setting their own offer as accepted or setting a offer amount.
        //TODO - Create error code for response, use rowsAffected > 0 as success metric on UpdateResult.
        const result = await this.travelService.update(
            //@ts-ignore
            request.user?.identifier,
            travel
        );

        response.status(200).send({
            message: SuccessConstants.TRAVEL_UPDATE,
            data: result
        });
    }
}
