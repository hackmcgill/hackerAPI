import {
    Entity,
    BaseEntity,
    Column,
    OneToMany,
    PrimaryGeneratedColumn
} from "typeorm";
import * as Constants from "../constants/general.constant";
import Hacker from "./hacker.model";

@Entity()
class Team extends BaseEntity {
    @PrimaryGeneratedColumn()
    identifier: number;

    @Column({ nullable: false, unique: true })
    name: string;

    //TODO: Implement max team size.
    @OneToMany(
        () => Hacker,
        (hacker) => hacker.team
    )
    hackers: Hacker[];

    @Column({ default: undefined })
    submission: string;

    @Column()
    project: string;
}

export default Team;
