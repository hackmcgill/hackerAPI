import { IsDate } from "class-validator";
import {
    Entity,
    BaseEntity,
    Column,
    JoinColumn,
    OneToOne,
    PrimaryGeneratedColumn
} from "typeorm";
import Account from "./account.model";

@Entity()
class PasswordReset {
    @PrimaryGeneratedColumn()
    readonly identifier: number;

    @OneToOne(() => Account)
    @JoinColumn()
    account: Account;

    @Column({ nullable: false })
    @IsDate()
    createdAt: Date;
}

export default PasswordReset;
