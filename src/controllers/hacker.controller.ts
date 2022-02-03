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
import Hacker from "@models/hacker.model";
import { HackerService } from "@services/hacker.service";
import * as SuccessConstants from "@constants/success.constant";
import * as ErrorConstants from "@constants/error.constant";
import {
    Request as ExpressRequest,
    Response as ExpressResponse
} from "express";
import { StorageService } from "@services/storage.service";
import { upload } from "@middlewares/multer.middleware";

@autoInjectable()
@Controller("/hacker")
export class HackerController {
    constructor(
        private readonly hackerService: HackerService,
        private readonly storageService: StorageService
    ) {}

    @Get("/self", [
        EnsureAuthenticated,
        EnsureAuthorization([
            AuthorizationLevel.Staff,
            AuthorizationLevel.Hacker
        ])
    ])
    async getSelf(
        @Request() request: ExpressRequest,
        @Response() response: ExpressResponse
    ) {
        const hacker:
            | Hacker
            | undefined = await this.hackerService.findByIdentifier(
            //@ts-ignore
            request.user?.identifier
        );

        return hacker
            ? response.status(200).json({
                  message: SuccessConstants.HACKER_READ,
                  data: hacker
              })
            : response.status(404).json({
                  message: ErrorConstants.HACKER_404_MESSAGE
              });
    }

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
        //TODO - Fix bug where Hacker status is None as it is passed into the API. (Maybe override the status variable somehow?)
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

    @Get("/resume/:identifier", [
        EnsureAuthenticated,
        EnsureAuthorization([
            AuthorizationLevel.Staff,
            AuthorizationLevel.Hacker
        ])
    ])
    async downloadResume(
        @Response() response: ExpressResponse,
        @Params("identifier") identifier: number
    ) {
        const hacker:
            | Hacker
            | undefined = await this.hackerService.findByIdentifier(identifier);

        const resume = await this.storageService.download(
            hacker!.application.general.URL.resume
        );

        resume
            ? response.status(200).send({
                  message: SuccessConstants.RESUME_DOWNLOAD,
                  data: {
                      identifier: identifier,
                      resume: resume
                  }
              })
            : response.status(404).send({
                  message: ErrorConstants.RESUME_404_MESSAGE
              });
    }

    @Post("/resume/:identifier", [
        EnsureAuthenticated,
        EnsureAuthorization([
            AuthorizationLevel.Staff,
            AuthorizationLevel.Hacker
        ]),
        upload.single("file")
    ])
    async uploadResume(
        @Request() request: ExpressRequest,
        @Response() response: ExpressResponse,
        @Params("identifier") identifier: number
    ) {
        if (!request.file)
            response.status(400).send({
                message: ErrorConstants.RESUME_404_MESSAGE
            });
        else {
            const fileName = `resumes/${Date.now()}-${identifier}`;

            await this.storageService.upload(request.file, fileName);

            //TODO - Implement affectedRows > 0 success check.
            const result = await this.hackerService.updateApplicationField(
                identifier,
                "general.URL.resume",
                request.file
            );

            response.status(200).send({
                message: SuccessConstants.RESUME_UPLOAD,
                data: { fileName: fileName }
            });
        }
    }
}

//TODO - Implement statistics features, batch accept/application change features, and status change emails.
