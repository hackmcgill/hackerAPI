import { Entity, BaseEntity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
class Settings extends BaseEntity {
    @PrimaryGeneratedColumn()
    identifier: number;

    @Column() // One month from now.
    openTime: Date;

    @Column() // One year and 1 month from now.
    closeTime: Date;

    @Column() // 1 year and 2 months from now.
    confirmTime: Date;

    @Column({ default: false })
    isRemote: boolean;

    toJSON() {
        return this;
    }
}

export default Settings;
