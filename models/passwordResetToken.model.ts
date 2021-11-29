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
class PasswordReset extends BaseEntity {
    @PrimaryGeneratedColumn()
    identifier: number;

    @OneToOne(() => Account)
    @JoinColumn()
    account: Account;

    @Column({ nullable: false })
    createdAt: Date;

    toJSON() {
        return this;
    }
}

export default PasswordReset;
