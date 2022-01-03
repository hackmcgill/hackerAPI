import { autoInjectable } from "tsyringe";
import { DeleteResult, getRepository, Repository } from "typeorm";
import Account from "@models/account.model";
import PasswordReset from "@models/password-reset-token.model";
import jwt from "jsonwebtoken";
import { EnvService } from "@services/env.service";

@autoInjectable()
export class PasswordResetService {
    private readonly passwordResetRepository: Repository<PasswordReset>;
    constructor(private readonly envService: EnvService) {
        this.passwordResetRepository = getRepository(PasswordReset);
    }

    public async findByIdentifier(
        identifier: number
    ): Promise<PasswordReset | undefined> {
        return await this.passwordResetRepository.findOne(identifier);
    }

    public async save(account: Account): Promise<PasswordReset> {
        this.invalidatePreviousRequests(account);

        return await this.passwordResetRepository.save({
            account: account,
            createdAt: new Date()
        });
    }

    public async delete(identifier: number): Promise<DeleteResult> {
        return await this.passwordResetRepository.delete({
            identifier: identifier
        });
    }

    private async invalidatePreviousRequests(
        account: Account
    ): Promise<DeleteResult> {
        return await this.passwordResetRepository.delete({
            account: { identifier: account.identifier }
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
            { expiresIn: "1 day" }
        );
    }
}
