import { autoInjectable, singleton } from "tsyringe";
import { getRepository, Repository } from "typeorm";
import AccountConfirmation from "../models/accountConfirmationToken.model";
import jwt from "jsonwebtoken";
import { EnvService } from "./env.service";

@autoInjectable()
@singleton()
export class AccountConfirmationService {
    private readonly accountConfirmationRepository: Repository<
        AccountConfirmation
    >;

    constructor(private readonly envService: EnvService) {
        this.accountConfirmationRepository = getRepository(AccountConfirmation);
    }

    public async findByIdentifier(
        identifier: number
    ): Promise<AccountConfirmation | undefined> {
        return await this.accountConfirmationRepository.findOne(identifier);
    }

    // TODO - Verify if this functionality works.
    // https://github.com/typeorm/typeorm/issues/4396
    // https://github.com/typeorm/typeorm/issues/2707
    public async findByAccount(
        identifier: number
    ): Promise<AccountConfirmation | undefined> {
        return await this.accountConfirmationRepository.findOne({
            where: { account: { identifier: identifier } }
        });
    }

    public async save(
        confirmation: Partial<AccountConfirmation>
    ): Promise<AccountConfirmation> {
        return await this.accountConfirmationRepository.save(confirmation);
    }

    public async delete(identifier: number) {
        return await this.accountConfirmationRepository.delete({
            identifier: identifier
        });
    }

    public generateLink(route: string, token: string): string {
        const domain = this.getDomain()!;
        const protocol = domain.includes("localhost") ? "http" : "https";
        return `${protocol}://${domain}/${route}?token=${token}`;
    }

    private getDomain() {
        return this.envService.isDevelopment()
            ? this.envService.get(`FRONTEND_ADDRESS_DEV`)
            : this.envService.isProduction()
            ? this.envService.get(`FRONTEND_ADDRESS_DEPLOY`)
            : this.envService.get(`FRONTEND_ADDRESS_DEV`);
    }

    public generateToken(identifier: number, account: number): string {
        return jwt.sign(
            {
                identifier: identifier,
                account: account
            },
            process.env.JWT_CONFIRM_ACC_SECRET ?? "default",
            { expiresIn: "1 week" }
        );
    }
}

// TODO - Implement account invite confirmation policy in the old accountConfirmation.service.ts file.
