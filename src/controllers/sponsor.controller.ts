import {
    Body,
    Controller,
    Get,
    Params,
    Patch,
    Post,
    Request,
    Response
} from "@decorators/express";
import { autoInjectable } from "tsyringe";
import { AuthorizationLevel } from "@constants/authorization-level.constant";
import { EnsureAuthenticated } from "@middlewares/authenticated.middleware";
import { EnsureAuthorization } from "@middlewares/authorization.middleware";
import Sponsor from "@models/sponsor.model";
import { SponsorService } from "@services/sponsor.service";
import { Request as ExpressRequest, Response as ExpressResponse } from "express";
import * as SuccessConstants from "@constants/success.constant";
import * as ErrorConstants from "@constants/error.constant";
import { Validator } from "@app/middlewares/validator.middleware";

@autoInjectable()
@Controller("/sponsor")
export class SponsorController {
    constructor(private readonly sponsorService: SponsorService) { }

    @Get("/self", [
        EnsureAuthenticated,
        EnsureAuthorization([
            AuthorizationLevel.Staff,
            AuthorizationLevel.Sponsor
        ])
    ])
    async getSelf(
        @Request() request: ExpressRequest,
        @Response() response: ExpressResponse,
    ) {
        const sponsor:
            | Sponsor
            | undefined = await this.sponsorService.findByIdentifier(
                //@ts-ignore
                request.user?.identifier
            );
        return sponsor
            ? response.status(200).json({
                message: SuccessConstants.SPONSOR_READ,
                data: sponsor
            })
            : response.status(404).json({
                message: ErrorConstants.SPONSOR_404_MESSAGE
            });
    }

    @Get("/:identifier", [
        EnsureAuthenticated,
        EnsureAuthorization([
            AuthorizationLevel.Staff,
            AuthorizationLevel.Sponsor
        ])
    ])
    async getByIdentifier(
        @Response() response: ExpressResponse,
        @Params("identifier") identifier: number
    ) {
        const sponsor:
            | Sponsor
            | undefined = await this.sponsorService.findByIdentifier(
                identifier
            );

        return sponsor
            ? response.status(200).json({
                message: SuccessConstants.SPONSOR_READ,
                data: sponsor
            })
            : response.status(404).json({
                message: ErrorConstants.SPONSOR_404_MESSAGE
            });
    }

    @Post("/", [
        EnsureAuthenticated,
        EnsureAuthorization([AuthorizationLevel.Staff]),
        Validator(Sponsor)
    ])
    async create(
        @Response() response: ExpressResponse,
        @Body() sponsor: Sponsor
    ) {
        const result = await this.sponsorService.save(sponsor);

        return result
            ? response.status(200).send({
                message: SuccessConstants.SPONSOR_CREATE,
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
            AuthorizationLevel.Sponsor
        ]),
        Validator(Sponsor)
    ])
    async update(
        @Response() response: ExpressResponse,
        @Params("identifier") identifier: number,
        @Body() update: Partial<Sponsor>
    ) {
        const result = await this.sponsorService.update(identifier, update);

        return result
            ? response.status(200).json({
                message: SuccessConstants.SPONSOR_UPDATE,
                data: result
            })
            : response.status(404).json({
                message: ErrorConstants.SPONSOR_404_MESSAGE,
                data: {
                    identifier: identifier
                }
            });
    }
}
