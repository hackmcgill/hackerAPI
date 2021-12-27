import { Body, Controller, Get, Params, Response } from "@decorators/express";
import { autoInjectable } from "tsyringe";
import { AuthorizationLevel } from "../constants/authorization-level.constant";
import { EnsureAuthenticated } from "../middlewares/authenticated.middleware";
import { EnsureAuthorization } from "../middlewares/authorization.middleware";
import { SearchService } from "../services/search.service";
import { Response as ExpressResponse } from "express";
import * as SuccessConstants from "../constants/success.constant";

export interface SearchBody {
    page?: number;
    limit?: number;
    sort?: string;
    expand?: boolean;
    model: string;
    q: any;
}

@autoInjectable()
@Controller("/search")
export class SearchController {
    constructor(private readonly searchService: SearchService) {}

    @Get("/", [
        EnsureAuthenticated,
        EnsureAuthorization([
            AuthorizationLevel.Staff,
            AuthorizationLevel.Sponsor,
            AuthorizationLevel.Volunteer
        ])
    ])
    async execute(
        @Response() response: ExpressResponse,
        @Body() body: SearchBody
    ) {
        if (!body.page) body.page = 0;
        if (!body.limit) body.limit = 10000;
        if (!body.sort) body.sort = "";
        if (!body.expand) body.expand = false;

        const result = await this.searchService.executeQuery(
            body.model,
            body.q,
            body.page,
            body.limit,
            body.sort,
            "",
            body.expand
        );

        response.status(200).send({
            message:
                result.length >= 1
                    ? SuccessConstants.SEARCH_QUERY
                    : SuccessConstants.SEARCH_NO_RESULTS,
            data: result
        });
    }
}
