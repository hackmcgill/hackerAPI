import { Setting } from "@models/setting.model";
import { getRepository, Repository, UpdateResult } from "typeorm";

export class SettingService {
    private readonly settingRepository: Repository<Setting>;

    constructor() {
        this.settingRepository = getRepository(Setting);
    }

    public async find(): Promise<Array<Setting>> {
        return await this.settingRepository.find();
    }

    public async findByIdentifier(
        identifier: number
    ): Promise<Setting | undefined> {
        return await this.settingRepository.findOne(identifier);
    }

    public async findByKey(key: string): Promise<Setting | undefined> {
        return await this.settingRepository.findOne({
            where: { key: key }
        });
    }

    public async save(setting: Setting): Promise<Setting> {
        return await this.settingRepository.save(setting);
    }

    public async update(
        identifier: number,
        setting: Partial<Setting>
    ): Promise<UpdateResult> {
        return await this.settingRepository.update(identifier, setting);
    }
}
