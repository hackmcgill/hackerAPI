import Travel from "@models/travel.model";
import { getRepository, Repository, UpdateResult } from "typeorm";
import { autoInjectable } from "tsyringe";
import Hacker from "@models/hacker.model";

@autoInjectable()
export class TravelService {
    private readonly travelRepository: Repository<Travel>;

    constructor() {
        this.travelRepository = getRepository(Travel);
    }

    public async findByIdentifier(
        identifier: number
    ): Promise<Travel | undefined> {
        return await this.travelRepository.findOne(identifier);
    }

    public async findByHacker(hacker: Hacker): Promise<Travel | undefined> {
        return await this.travelRepository.findOne({
            relations: ["hacker"],
            where: { hacker: hacker }
        });
    }

    public async update(
        identifier: number,
        travel: Partial<Travel>
    ): Promise<UpdateResult> {
        return await this.travelRepository.update(identifier, travel);
    }

    public async save(travel: Travel): Promise<Travel> {
        return await this.travelRepository.save(travel);
    }
}
