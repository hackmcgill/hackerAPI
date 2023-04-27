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

    @Column({ type: String, nullable: true })
    submission?: string | null;

    @Column({ type: String, nullable: true })
    project?: string | null;
}

export default Team;
