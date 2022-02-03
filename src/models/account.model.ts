import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { compareSync } from "bcrypt";
import {
    IsEmail,
    IsEnum,
    IsOptional,
    IsPhoneNumber,
    IsString,
    Length
} from "class-validator";
import { UserType } from "@constants/general.constant";
import { Exclude, instanceToPlain } from "class-transformer";

@Entity()
class Account {
    @PrimaryGeneratedColumn()
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

    @Column({ array: true })
    dietaryRestrictions: string;

    @Column({ default: false })
    confirmed: boolean;

    @Column({
        enum: UserType,
        default: UserType.Hacker
    })
    @IsOptional()
    @IsEnum(UserType)
    accountType: string;

    @Column("date", { nullable: false })
    birthDate: Date;

    @Column()
    @IsPhoneNumber()
    phoneNumber: string;

    toJSON() {
        return instanceToPlain(this);
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
     * Calculates the user's age
     */
    getAge() {
        // birthday is a date
        const ageDifMs = Date.now() - this.birthDate.getTime();
        const ageDate = new Date(ageDifMs); // miliseconds from epoch
        return Math.abs(ageDate.getUTCFullYear() - 1970);
    }
}

export default Account;
