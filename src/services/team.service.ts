import Team from "@models/team.model";
import { getRepository, Repository, UpdateResult } from "typeorm";
import { autoInjectable, singleton } from "tsyringe";
import Hacker from "@models/hacker.model";

@autoInjectable()
@singleton()
export class TeamService {
    private readonly teamRepository: Repository<Team>;

    constructor() {
        this.teamRepository = getRepository(Team);
    }

    public async findByIdentifier(
        identifier: number
    ): Promise<Team | undefined> {
        return await this.teamRepository.findOne(identifier, {
            relations: ["members", "members.account"]
        });
    }

    public async findByName(name: string): Promise<Team | undefined> {
        return await this.teamRepository.findOne({
            where: { name: name },
            relations: ["members", "members.account"]
        });
    }

    public async findByHacker({
        account: { identifier }
    }: Hacker): Promise<Team | undefined> {
        return await this.teamRepository
            .createQueryBuilder("team")
            .leftJoinAndSelect("team.members", "hacker")
            .where("hacker.identifier = :identifier", { identifier })
            .getOne();
    }

    public async addMember(
        identifier: number,
        hacker: Hacker
    ): Promise<boolean> {
        const team = await this.findByIdentifier(identifier);

        if (team && team.members.length < 4) {
            await this.teamRepository
                .createQueryBuilder()
                .relation("members")
                .of(team)
                .add(hacker);
            return true;
        }

        return false;
    }

    public async removeMember(hacker: Hacker): Promise<void> {
        await this.teamRepository
            .createQueryBuilder("team")
            .relation(Hacker, "team")
            .of(hacker)
            .set({ team: null });
    }

    public async update(
        identifier: number,
        team: Partial<Team>
    ): Promise<UpdateResult> {
        return await this.teamRepository.update(identifier, team);
    }

    public async save(team: Team): Promise<Team> {
        return await this.teamRepository.save(team);
    }
}
