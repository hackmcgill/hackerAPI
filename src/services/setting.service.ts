import { Setting } from "@models/setting.model";
import { getRepository, Repository, UpdateResult } from "typeorm";

export class SettingService {
    private readonly settingRepository: Repository<Setting>;

    constructor() {
        this.settingRepository = getRepository(Setting);
    }

    public flattenOne(setting: Setting) {
        const key = setting.key;
        let value: string | number | boolean = setting.value;
        if (!isNaN(+value)) {
            value = +value;
        } else if (value == "true") {
            value = true;
        } else if (value == "false") {
            value = false;
        }
        return { [key]: value }
    }

    public flatten(settings: Array<Setting>): { [setting: string]: string | number | boolean } {
        const flattened = {};
        settings.forEach((setting) => Object.assign(flattened, this.flattenOne(setting)))
        return flattened;
    }

    public async find(): Promise<any> {
        return this.flatten(await this.settingRepository.find());
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

    public async update(settings: { [setting: string]: string | number | boolean }) {
        for (let [key, value] of Object.entries(settings)) {
            value = value.toString();
            const setting = await this.findByKey(key);
            if (setting) {
                setting.value = value.toString();
                await this.settingRepository.save(setting);
            } else {
                await this.settingRepository.save({key, value});
            }
        }
    }

    public async updateOne(
        identifier: number,
        setting: Partial<Setting>
    ): Promise<UpdateResult> {
        return await this.settingRepository.update(identifier, setting);
    }
}
