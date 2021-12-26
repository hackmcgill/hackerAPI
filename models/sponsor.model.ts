import { IsInt, IsString } from "class-validator";
import {
    Entity,
    Column,
    ManyToMany,
    JoinTable,
    OneToOne,
    JoinColumn
} from "typeorm";
import Account from "./account.model";
import Hacker from "./hacker.model";

@Entity()
class Sponsor {
    @Column({ default: 0 })
    @IsInt()
    tier: number;

    @Column({ nullable: false })
    @IsString()
    company: string;

    @Column({ nullable: false })
    @IsString()
    contract: string;

    @ManyToMany(() => Hacker)
    @JoinTable()
    nominees: Hacker[];

    @OneToOne(() => Account, { primary: true })
    @JoinColumn()
    account: Account;
}

export default Sponsor;
