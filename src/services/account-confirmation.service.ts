import { autoInjectable, singleton } from "tsyringe";
import { DeleteResult, getRepository, Repository } from "typeorm";
import AccountConfirmation from "@models/account-confirmation-token.model";
import jwt from "jsonwebtoken";

@autoInjectable()
@singleton()
export class AccountConfirmationService {
    private readonly accountConfirmationRepository: Repository<
        AccountConfirmation
    >;

    constructor() {
        this.accountConfirmationRepository = getRepository(AccountConfirmation);
    }

    public async find(): Promise<Array<AccountConfirmation>> {
        return await this.accountConfirmationRepository.find();
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
            relations: ["account"],
            where: { account: { identifier: identifier } }
        });
    }

    public async save(
        confirmation: Partial<AccountConfirmation>
    ): Promise<AccountConfirmation> {
        return await this.accountConfirmationRepository.save(confirmation);
    }

    public async delete(identifier: number): Promise<DeleteResult> {
        return await this.accountConfirmationRepository.delete({
            identifier: identifier
        });
    }

    public generateLink(route: string, token: string): string {
        return `${process.env.FRONTEND_ADDRESS_DEV}/${route}?token=${token}`;
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
