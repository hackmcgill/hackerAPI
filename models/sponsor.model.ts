import Account from "./account.model";
import { Entity, Column, ManyToMany, JoinTable } from "typeorm";
import Hacker from "./hacker.model";

@Entity()
class Sponsor extends Account {
    @Column({ default: 0 })
    tier: number;

    @Column({ nullable: false })
    company: string;

    @Column({ nullable: false })
    contract: string;

    @ManyToMany(() => Hacker)
    @JoinTable()
    nominees: Hacker[];
}

export default Sponsor;
