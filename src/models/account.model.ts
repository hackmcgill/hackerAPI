import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { compareSync } from "bcrypt";
import {
    IsDate,
    IsEmail,
    IsEnum,
    IsInt,
    IsPhoneNumber,
    IsString,
    Length
} from "class-validator";
import * as Constants from "../constants/general.constant";
import { classToPlain, Exclude } from "class-transformer";

@Entity()
class Account {
    @PrimaryGeneratedColumn()
    @IsInt()
    readonly identifier: number;

    @Column({ nullable: false })
    @IsString()
    firstName: string;

    @Column({ nullable: false })
    @IsString()
    lastName: string;

    @Column({ default: "Prefer not to say" })
    @IsString()
    pronoun: string;

    @Column({ default: "Prefer not to say" })
    @IsString()
    gender: string;

    @Column({ nullable: false, unique: true })
    @IsEmail()
    email: string;

    @Column({ nullable: false })
    @Exclude({ toPlainOnly: true })
    @Length(8, 255)
    password: string;

    @Column()
    @IsString()
    dietaryRestrictions: string;

    @Column({ default: false })
    confirmed: boolean;

    @Column({
        enum: Constants.EXTENDED_USER_TYPES,
        default: Constants.HACKER
    })
    @IsEnum(Constants.EXTENDED_USER_TYPES)
    accountType: string;

    @Column("date", { nullable: false })
    @IsDate()
    birthDate: Date;

    @Column()
    @IsPhoneNumber()
    phoneNumber: string;

    toJSON() {
        return classToPlain(this);
    }

    /**
     * Pass in an un-encrypted password and see whether it matches the
     * encrypted password
     * @param {String} password
     */
    comparePassword(password: string) {
        return compareSync(password, this.password);
    }

    /**
     * Returns if the accountType corresponds to a sponsor
     */
    isSponsor() {
        return (
            Constants.SPONSOR_TIERS.includes(this.accountType) ||
            this.accountType == Constants.SPONSOR
        );
    }

    /**
     * Calculates the user's age
     */
    getAge() {
        // birthday is a date
        var ageDifMs = Date.now() - this.birthDate.getTime();
        var ageDate = new Date(ageDifMs); // miliseconds from epoch
        return Math.abs(ageDate.getUTCFullYear() - 1970);
    }
}

export default Account;
