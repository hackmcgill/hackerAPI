import { IsString } from "class-validator";
import {
    Entity,
    BaseEntity,
    Column,
    OneToMany,
    PrimaryGeneratedColumn
} from "typeorm";
import Hacker from "./hacker.model";

@Entity()
class Team {
    @PrimaryGeneratedColumn()
    identifier: number;

    @Column({ nullable: false, unique: true })
    @IsString()
    name: string;

    //TODO: Implement max team size.
    @OneToMany(
        () => Hacker,
        (hacker) => hacker.team
    )
    hackers: Hacker[];

    @Column({ default: undefined })
    @IsString()
    submission: string;

    @Column()
    @IsString()
    project: string;
}

export default Team;
