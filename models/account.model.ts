import { Column, Entity, PrimaryGeneratedColumn, BaseEntity } from "typeorm";
import { compareSync } from "bcrypt";
import { IsEmail, IsPhoneNumber } from "class-validator";
import * as Constants from "../constants/general.constant";

@Entity()
export class Account extends BaseEntity {
    @PrimaryGeneratedColumn()
    identifier: number;

    @Column("varchar", { nullable: false })
    firstName: string;

    @Column("varchar", { nullable: false })
    lastName: string;

    @Column("varchar", { default: "Prefer not to say" })
    pronoun: string;

    @Column("varchar", { default: "Prefer not to say" })
    gender: string;

    @Column("varchar", { nullable: false, unique: true })
    @IsEmail()
    email: string;

    @Column("varchar", { nullable: false })
    password: string;

    @Column("varchar")
    dietaryRestrictions: string;

    @Column("bool", { default: false })
    confirmed: Boolean;

    @Column({
        enum: Constants.EXTENDED_USER_TYPES,
        default: Constants.HACKER
    })
    accountType: string;

    @Column("date", { nullable: false })
    birthDate: Date;

    @Column()
    @IsPhoneNumber()
    phoneNumber: number;

    toJSON() {
        return this;
    }

    // Delete's Password
    toStrippedJSON() {
        return { ...this, password: undefined };
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
