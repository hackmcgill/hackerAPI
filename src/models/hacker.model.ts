import { HackerStatus } from "@constants/general.constant";
import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToOne,
    PrimaryColumn
} from "typeorm";
import Account from "@models/account.model";
import { ApplicationSchema } from "@models/application.model";
import Team from "@models/team.model";

@Entity()
class Hacker {
    @PrimaryColumn()
    identifier: number;

    @OneToOne(() => Account, { cascade: false })
    @JoinColumn({ name: "identifier" })
    account: Account;

    @Column({
        enum: HackerStatus,
        nullable: false,
        default: HackerStatus.None
    })
    status: string;

    @Column("jsonb")
    application: ApplicationSchema;

    //TODO: Implement Team One To One
    @ManyToOne(
        () => Team,
        (team) => team.members
    )
    @JoinColumn({ referencedColumnName: "identifier" })
    team?: Team;
}

export default Hacker;
