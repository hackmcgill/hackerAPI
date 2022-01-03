import { IsString } from "class-validator";
import {
    Entity,
    Column,
    OneToMany,
    PrimaryGeneratedColumn,
    JoinColumn
} from "typeorm";
import Hacker from "@models/hacker.model";

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
        (hacker) => hacker.team,
        { cascade: true, eager: true }
    )
    @JoinColumn()
    members: Array<Hacker>;

    @Column({ nullable: true })
    @IsString()
    submission?: string;

    @Column({ nullable: true })
    @IsString()
    project?: string;
}

export default Team;
