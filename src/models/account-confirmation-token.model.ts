import { IsEmail, IsEnum } from "class-validator";
import {
    Entity,
    Column,
    JoinColumn,
    OneToOne,
    PrimaryGeneratedColumn,
    PrimaryColumn
} from "typeorm";
import Account from "@models/account.model";
import * as GeneralConstants from "@constants/general.constant";

@Entity()
class AccountConfirmation {
    @PrimaryColumn()
    readonly identifier: number;

    @OneToOne(() => Account)
    @JoinColumn({ name: "identifier" })
    account?: Account;

    @Column({
        enum: GeneralConstants.EXTENDED_USER_TYPES,
        default: GeneralConstants.HACKER
    })
    @IsEnum(GeneralConstants.EXTENDED_USER_TYPES)
    accountType: string;

    @Column({ nullable: false })
    @IsEmail()
    email: string;

    @Column({
        enum: GeneralConstants.CONFIRMATION_TYPES,
        default: GeneralConstants.CONFIRMATION_TYPE_ORGANIC
    })
    @IsEnum(GeneralConstants.CONFIRMATION_TYPES)
    confirmationType: string;
}

export default AccountConfirmation;
