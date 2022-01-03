import { IsDate } from "class-validator";
import {
    Entity,
    Column,
    JoinColumn,
    OneToOne,
    PrimaryGeneratedColumn
} from "typeorm";
import Account from "@models/account.model";

@Entity()
class PasswordReset {
    @PrimaryGeneratedColumn()
    readonly identifier: number;

    @OneToOne(() => Account)
    @JoinColumn({ name: "identifier" })
    account: Account;

    @Column({ nullable: false })
    @IsDate()
    createdAt: Date;
}

export default PasswordReset;
