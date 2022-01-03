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
import {
    Request as ExpressRequest,
    Response as ExpressResponse
} from "express";
import { EnsureAuthenticated } from "../middlewares/authenticated.middleware";
import { EnsureAuthorization } from "../middlewares/authorization.middleware";
import { AuthorizationLevel } from "../constants/authorization-level.constant";
import Team from "../models/team.model";
import { TeamService } from "../services/team.service";
import * as SuccessConstants from "../constants/success.constant";
import * as ErrorConstants from "../constants/error.constant";
import { HackerService } from "../services/hacker.service";
import Hacker from "../models/hacker.model";
import { HackerStatus } from "@constants/general.constant";

interface MemberInfo {
    firstName: string;
    lastName: string;
    status: string;
    school: string;
}

type TeamWithoutMembers = Omit<Team, "members">;

@autoInjectable()
@Controller("/team")
export class TeamController {
    constructor(
        private readonly teamService: TeamService,
        private readonly hackerService: HackerService
    ) {}

    @Get("/:identifier", [
        EnsureAuthenticated,
        EnsureAuthorization(
            [AuthorizationLevel.Staff, AuthorizationLevel.Hacker],
            true
        )
    ])
    async getByIdentifier(
        @Response() response: ExpressResponse,
        @Params("identifier") identifier: number
    ) {
        const team: Team | undefined = await this.teamService.findByIdentifier(
            identifier
        );

        const teamWithoutMembers: TeamWithoutMembers = team as TeamWithoutMembers;
        const members: Array<MemberInfo> = [];

        if (team)
            team.members.forEach((member) =>
                members.push({
                    firstName: member.account.firstName,
                    lastName: member.account.lastName,
                    school: member.application.general.school,
                    status: member.status
                })
            );

        return team
            ? response.status(200).json({
                  message: SuccessConstants.TEAM_READ,
                  data: {
                      team: teamWithoutMembers,
                      members: members
                  }
              })
            : response.status(404).json({
                  message: ErrorConstants.TEAM_404_MESSAGE
              });
    }

    @Post("/", [
        EnsureAuthenticated,
        EnsureAuthorization([
            AuthorizationLevel.Staff,
            AuthorizationLevel.Hacker
        ])
    ])
    async create(@Response() response: ExpressResponse, @Body() team: Team) {
        const result = await this.teamService.save(team);

        //TODO - Figure out why we do not automatically add the first member to the team.
        // The cascade should be working and automatically adding the relationship, but it does not.
        if (result)
            this.teamService.addMember(result.identifier, team.members[0]);

        //TODO - Change duplicate message from Account to Team.
        return result
            ? response.status(200).send({
                  message: SuccessConstants.TEAM_CREATE,
                  data: result
              })
            : response.status(422).send({
                  message: ErrorConstants.ACCOUNT_DUPLICATE_422_MESSAGE
              });
    }

    @Patch("/:hackerIdentifier", [
        EnsureAuthenticated,
        EnsureAuthorization([
            AuthorizationLevel.Staff,
            AuthorizationLevel.Hacker
        ])
    ])
    async update(
        @Response() response: ExpressResponse,
        @Params("hackerIdentifier") hackerIdentifier: number,
        @Body() update: Partial<Omit<Team, "members">>
    ) {
        const team: Team | undefined = (
            await this.hackerService.findByIdentifier(hackerIdentifier)
        )?.team;

        if (team) {
            const result = this.teamService.update(team.identifier, update);

            response.status(200).send({
                message: SuccessConstants.TEAM_UPDATE,
                data: result
            });
        }

        response.status(400).send({
            message: ErrorConstants.TEAM_404_MESSAGE
        });
    }

    @Patch("/members/join", [
        EnsureAuthenticated,
        EnsureAuthorization([AuthorizationLevel.Hacker])
    ])
    async joinTeam(
        @Request() request: ExpressRequest,
        @Response() response: ExpressResponse,
        @Body("name") name: string
    ) {
        const hacker:
            | Hacker
            | undefined = await this.hackerService.findByIdentifier(
            //@ts-ignore
            request.user?.identifier
        );

        if (!hacker)
            response.status(404).send({
                message: ErrorConstants.HACKER_404_MESSAGE,
                data: {
                    //@ts-ignore
                    identifier: request.user?.identifier
                }
            });

        const team: Team | undefined = await this.teamService.findByName(name);

        if (!team)
            response.status(404).send({
                message: ErrorConstants.TEAM_404_MESSAGE,
                data: {
                    name: name
                }
            });

        if (hacker?.team) {
            if (hacker?.team?.identifier == team?.identifier)
                response.status(409).send({
                    message: ErrorConstants.TEAM_JOIN_SAME_409_MESSAGE,
                    data: {
                        name: name
                    }
                });
            await this.teamService.removeMember(hacker);
        }

        if (!(await this.teamService.addMember(team?.identifier!, hacker!)))
            response.status(409).send({
                message: ErrorConstants.TEAM_SIZE_409_MESSAGE
            });

        response.status(200).send({
            message: SuccessConstants.TEAM_JOIN
        });
    }

    @Patch("/members/leave", [
        EnsureAuthenticated,
        EnsureAuthorization([AuthorizationLevel.Hacker])
    ])
    async leaveTeam(
        @Request() request: ExpressRequest,
        @Response() response: ExpressResponse
    ) {
        const hacker:
            | Hacker
            | undefined = await this.hackerService.findByIdentifier(
            //@ts-ignore
            request.user?.identifier
        );

        if (!hacker)
            response.status(404).send({
                message: ErrorConstants.HACKER_404_MESSAGE
            });
        else {
            if (hacker.team) await this.teamService.removeMember(hacker);
            else
                response.status(404).send({
                    message: ErrorConstants.TEAM_404_MESSAGE
                });
        }

        response.status(200).send({
            message: SuccessConstants.TEAM_HACKER_LEAVE
        });
    }
}
