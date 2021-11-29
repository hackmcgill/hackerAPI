import {
    Entity,
    BaseEntity,
    Column,
    JoinColumn,
    OneToOne,
    PrimaryGeneratedColumn
} from "typeorm";
import Account from "./account.model";

const Constants = {
    General: require("../constants/general.constant")
};

@Entity()
class AccountConfirmation extends BaseEntity {
    @PrimaryGeneratedColumn()
    identifier: number;

    @OneToOne(() => Account)
    @JoinColumn()
    account?: Account;

    @Column({
        enum: Constants.General.EXTENDED_USER_TYPES,
        default: Constants.General.HACKER
    })
    accountType: string;

    @Column({ nullable: false })
    email: string;

    @Column({
        enum: Constants.General.CONFIRMATION_TYPES,
        default: Constants.General.CONFIRMATION_TYPE_ORGANIC
    })
    confirmationType: string;

    toJSON() {
        return this;
    }
}

export default AccountConfirmation;
