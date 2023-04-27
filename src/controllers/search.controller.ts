import { Body, Controller, Get, Query, Response } from "@decorators/express";
import { autoInjectable } from "tsyringe";
import { AuthorizationLevel } from "@constants/authorization-level.constant";
import { EnsureAuthenticated } from "@middlewares/authenticated.middleware";
import { EnsureAuthorization } from "@middlewares/authorization.middleware";
import { Filter, SearchService } from "@services/search.service";
import { Response as ExpressResponse } from "express";
import * as SuccessConstants from "@constants/success.constant";

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
        @Query("model") model: string,
        @Query("q") filters: string
    ) {
        const result = await this.searchService.executeQuery(
            model,
            JSON.parse(filters)
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
