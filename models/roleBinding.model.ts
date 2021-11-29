import {
    Entity,
    BaseEntity,
    OneToOne,
    ManyToOne,
    JoinColumn,
    Column,
    PrimaryGeneratedColumn
} from "typeorm";
import Account from "./account.model";
import Role from "./role.model";

@Entity()
class RoleBinding extends BaseEntity {
    @PrimaryGeneratedColumn()
    identifier: number;

    @OneToOne(() => Account)
    @JoinColumn()
    //@Column({ nullable: false, unique: true })
    account: Account;

    //TODO: This might be broken. (OneToMany?)
    @ManyToOne(() => Role)
    @JoinColumn()
    roles: Role[];

    toJSON() {
        return this;
    }
}

export default RoleBinding;
