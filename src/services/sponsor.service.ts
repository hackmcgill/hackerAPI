import { UpdateResult } from "typeorm";

import { autoInjectable, singleton } from "tsyringe";
import { getRepository, Repository } from "typeorm";
import Sponsor from "@models/sponsor.model";

@autoInjectable()
@singleton()
export class SponsorService {
    constructor(
        private readonly sponsorRepository: Repository<Sponsor> = getRepository(
            Sponsor
        )
    ) {}

    public async findByIdentifier(
        identifier: number
    ): Promise<Sponsor | undefined> {
        return await this.sponsorRepository.findOne(identifier);
    }

    public async save(sponsor: Sponsor): Promise<Sponsor> {
        return await this.sponsorRepository.save(sponsor);
    }

    public async update(
        identifier: number,
        sponsor: Partial<Sponsor>
    ): Promise<UpdateResult> {
        return await this.sponsorRepository.update(identifier, sponsor);
    }
}
