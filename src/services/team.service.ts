import Team from "../models/team.model";
import { getRepository, Repository, UpdateResult } from "typeorm";
import { autoInjectable, singleton } from "tsyringe";
import Hacker from "../models/hacker.model";

@autoInjectable()
@singleton()
export class TeamService {
    private readonly teamRepository: Repository<Team>;

    constructor() {
        this.teamRepository = getRepository(Team);
    }

    public async findByIdentifier(identifier: number) {
        return await this.teamRepository.findOne(identifier);
    }

    public async findByName(name: string) {
        return await this.teamRepository.findOne({ where: { name: name } });
    }

    public async findByHacker({ account }: Hacker) {
        const identifier = account.identifier;
        return await this.teamRepository
            .createQueryBuilder("team")
            .leftJoinAndSelect("team.hackers", "hacker")
            .where("hacker.accountIdentifier = :identifier", { identifier })
            .getOne();
    }

    public async addMember(
        identifier: number,
        hacker: Hacker
    ): Promise<boolean> {
        const team = await this.findByIdentifier(identifier);

        if (team && team.hackers.length < 4) {
            await this.teamRepository
                .createQueryBuilder()
                .relation("hackers")
                .of(team)
                .add(hacker);
            return true;
        }

        return false;
    }

    public async removeMember(
        identifier: number,
        hacker: Hacker
    ): Promise<boolean> {
        const team = await this.findByIdentifier(identifier);

        if (team) {
            await this.teamRepository
                .createQueryBuilder()
                .relation("hackers")
                .of(team)
                .remove(hacker);
            // This team had 1 hacker left, and we removed them just above, thus we delete it.
            if (team.hackers.length == 1)
                await this.teamRepository.remove(team);
            return true;
        }

        return false;
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
