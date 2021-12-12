import Account from "../models/account.model";
import { hashSync } from "bcrypt";
import { getRepository, Repository, UpdateResult } from "typeorm";
import { autoInjectable } from "tsyringe";

@autoInjectable()
export class AccountService {
    private readonly accountRepository: Repository<Account>;

    constructor() {
        this.accountRepository = getRepository(Account);
    }

    public async findByIdentifier(
        identifier: number
    ): Promise<Account | undefined> {
        return await this.accountRepository.findOne(identifier);
    }

    public async findByEmail(email: string): Promise<Account | undefined> {
        return await this.accountRepository.findOne({
            where: { email: email }
        });
    }

    public async save(account: Account): Promise<Account> {
        account.password = this.hashPassword(account.password);
        return await this.accountRepository.save(account);
    }

    public async update(
        identifier: number,
        account: Partial<Account>
    ): Promise<UpdateResult> {
        return await this.accountRepository.update(identifier, account);
    }

    public async updateEmail(
        identifier: number,
        email: string
    ): Promise<UpdateResult> {
        return await this.accountRepository.update(identifier, {
            email: email,
            confirmed: false
        });
    }

    public async updatePassword(identifier: number, password: string) {
        return await this.accountRepository.update(identifier, {
            password: this.hashPassword(password)
        });
    }

    public async getAccountIfValid(
        email: string,
        password: string
    ): Promise<Account | undefined> {
        const account = await this.findByEmail(email);
        return account && account.comparePassword(password)
            ? account
            : undefined;
    }

    public hashPassword(password: string): string {
        return hashSync(password, 10);
    }
}
