import { autoInjectable, singleton } from "tsyringe";
import { getRepository, Repository, UpdateResult } from "typeorm";
import Hacker from "@models/hacker.model";
import { toDataURL } from "qrcode";

@autoInjectable()
@singleton()
export class HackerService {
    private readonly hackerRepository: Repository<Hacker>;

    constructor() {
        this.hackerRepository = getRepository(Hacker);
    }

    public async findByIdentifier(
        identifier: number
    ): Promise<Hacker | undefined> {
        /**
         * This code finds the hacker by it's identifier, loads the account data, and
         * instead of loading the team as a json, simply returns the identifier.
         * This approach gives us the best of both worlds.
         */
        return await this.hackerRepository
            .createQueryBuilder("hacker")
            .where("hacker.identifier = :identifier", {
                identifier: identifier
            })
            .loadAllRelationIds({ relations: ["team"] })
            .leftJoinAndSelect("hacker.account", "account")
            .getOne();
    }

    public async save(hacker: Hacker): Promise<Hacker> {
        return await this.hackerRepository.save(hacker);
    }

    public async update(
        identifier: number,
        hacker: Partial<Hacker>
    ): Promise<UpdateResult> {
        return await this.hackerRepository.update(identifier, hacker);
    }

    public async updateApplicationField(
        identifier: number,
        path: string,
        value: any
    ): Promise<UpdateResult> {
        return await this.hackerRepository
            .createQueryBuilder()
            .update()
            .set({
                application: () =>
                    `jsonb_set(application, '${path}', '"${value}"')`
            })
            .where("identifier = :identifier", {
                identifier: identifier
            })
            .execute();
    }

    public async generateQRCode(data: string) {
        return await toDataURL(data, {
            scale: 4
        });
    }

    public generateHackerApplicationViewLink(identifier: string): string {
        return `${process.env.FRONTEND_ADDRESS}/application/view/${identifier}`;
    }
}

/*
async function getStatsAllHackersCached() {
    const TAG = `[ hacker Service # getStatsAll ]`;
    if (cache.get(Constants.CACHE_KEY_STATS) !== null) {
        logger.info(`${TAG} Getting cached stats`);
        return cache.get(Constants.CACHE_KEY_STATS);
    }

    const allHackers = await Hacker.find().then((hackers) => {
        logger.updateCallbackFactory(TAG, "hacker");
        return hackers;
    });
    const stats = getStats(allHackers);
    cache.put(Constants.CACHE_KEY_STATS, stats, Constants.CACHE_TIMEOUT_STATS); //set a time-out of 5 minutes
    return stats;
}*/

/*function getStats(hackers: Hacker[]): Object {
    const TAG = `[ hacker Service # getStats ]`;
    const stats = {
        total: 0,
        status: {},
        school: {},
        degree: {},
        gender: {},
        travel: {},
        ethnicity: {},
        jobInterest: {},
        fieldOfStudy: {},
        graduationYear: {},
        dietaryRestrictions: {},
        shirtSize: {},
        age: {},
        applicationDate: {}
    };

    hackers.forEach((hacker) => {
        if (!hacker.identifier) {
            // user is no longer with us for some reason :(
            return;
        }
        stats.total += 1;
        //TODO - Fix this functionality.
        /*
        stats.status[hacker.status] = stats.status[hacker.status]
            ? stats.status[hacker.status] + 1
            : 1;
        stats.school[hacker.application.general.school] = stats.school[
            hacker.application.general.school
        ]
            ? stats.school[hacker.application.general.school] + 1
            : 1;
        stats.degree[hacker.application.general.degree] = stats.degree[
            hacker.application.general.degree
        ]
            ? stats.degree[hacker.application.general.degree] + 1
            : 1;
        stats.gender[hacker.accountId.gender] = stats.gender[
            hacker.accountId.gender
        ]
            ? stats.gender[hacker.accountId.gender] + 1
            : 1;
        stats.travel[hacker.application.accommodation.travel] = stats.travel[
            hacker.application.accommodation.travel
        ]
            ? stats.travel[hacker.application.accommodation.travel] + 1
            : 1;

        for (const ethnicity of hacker.application.other.ethnicity) {
            stats.ethnicity[ethnicity] = stats.ethnicity[ethnicity]
                ? stats.ethnicity[ethnicity] + 1
                : 1;
        }

        stats.jobInterest[hacker.application.general.jobInterest] = stats
            .jobInterest[hacker.application.general.jobInterest]
            ? stats.jobInterest[hacker.application.general.jobInterest] + 1
            : 1;
        stats.fieldOfStudy[hacker.application.general.fieldOfStudy] = stats
            .fieldOfStudy[hacker.application.general.fieldOfStudy]
            ? stats.fieldOfStudy[hacker.application.general.fieldOfStudy] + 1
            : 1;
        stats.graduationYear[hacker.application.general.graduationYear] = stats
            .graduationYear[hacker.application.general.graduationYear]
            ? stats.graduationYear[hacker.application.general.graduationYear] +
              1
            : 1;
        for (const dietaryRestrictions of hacker.accountId
            .dietaryRestrictions) {
            stats.dietaryRestrictions[dietaryRestrictions] = stats
                .dietaryRestrictions[dietaryRestrictions]
                ? stats.dietaryRestrictions[dietaryRestrictions] + 1
                : 1;
        }
        stats.shirtSize[hacker.application.accommodation.shirtSize] = stats
            .shirtSize[hacker.application.accommodation.shirtSize]
            ? stats.shirtSize[hacker.application.accommodation.shirtSize] + 1
            : 1;
        const age = hacker.accountId.getAge();
        stats.age[age] = stats.age[age] ? stats.age[age] + 1 : 1;

        const applicationDate = hacker._id
            .getTimestamp() //
            .toISOString() // converts Date to "YYYY-MM-DDTHH:mm:ss.sssZ" format
            .slice(0, 10); // slice(beginIndex, endIndex) extracts string from beginIndex to endIndex, used to convert to "YYYY-MM-DD" format

        stats.applicationDate[applicationDate] = stats.applicationDate[
            applicationDate
        ]
            ? stats.applicationDate[applicationDate] + 1
            : 1;
            */
//});
//return stats;
//}
