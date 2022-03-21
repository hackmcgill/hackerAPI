import { getRepository, MigrationInterface, QueryRunner } from "typeorm";

export const SettingsSeed = [
    {
        key: "HACKATHON_YEAR",
        value: "10"
    },
    {
        key: "APPLICATION_OPEN",
        value: `${Date.now() - 100}`
    },
    {
        key: "APPLICATION_CLOSE",
        value: `${Date.now() + 10000000000}`
    },
    {
        key: "APPLICATION_CONFIRM",
        value: `${Date.now() + 100000000000000}`
    },
    {
        key: "IS_REMOTE",
        value: `${false}`
    },
    {
        key: "SOCIAL_MEDIA_FACEBOOK",
        value: "https://www.facebook.com/mcgillhacks"
    },
    {
        key: "SOCIAL_MEDIA_TWITTER",
        value: "https://twitter.com/mcgillhacks"
    },
    {
        key: "SOCIAL_MEDIA_INSTAGRAM",
        value: "https://instagram.com/mcgillhacks"
    },
    {
        key: "SOCIAL_MEDIA_DISCORD",
        value: ""
    },
    {
        key: "SOCIAL_MEDIA_EMAIL",
        value: "contact@mchacks.ca"
    },
    {
        key: "SOCIAL_MEDIA_DEVPOST",
        value: "mchacks.devpost.com"
    }
];

export class SeedSettings1643998687434 implements MigrationInterface {
    public async up(_: QueryRunner): Promise<void> {
        await getRepository("setting").save(SettingsSeed);
    }

    public async down(_: QueryRunner): Promise<void> {}
}
