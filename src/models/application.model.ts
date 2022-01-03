import { IsInt } from "class-validator";
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    JoinColumn,
    OneToOne
} from "typeorm";
import Hacker from "@models/hacker.model";

export interface ApplicationSchema {
    general: {
        school: string;
        degree: string;
        fieldOfStudy: Array<string>;
        graduationYear: number;
        jobInterest: string;
        URL: {
            //gcloud bucket link
            resume: string;
            github?: string;
            dribbble?: string;
            personal?: string;
            linkedIn?: string;
            other?: string;
        };
    };
    shortAnswer: {
        skills: Array<string>;
        //any miscelaneous comments that the user has
        comments: string;
        //"Why do you want to come to our hackathon?"
        question1: string;
        // "Some Q"
        question2: string;
        previousHackathons: number;
    };
    other: {
        ethnicity: Array<string>;
        privacyPolicy: boolean;
        codeOfConduct: boolean;
    };
    accommodation: {
        impairments?: string;
        barriers?: string;
        shirtSize: string;
        travel: number;
        attendancePreference: string;
    };
    //TODO: Add team back?
    location: {
        timeZone?: string;
        country?: string;
        city?: string;
    };
}

@Entity()
class Application {
    @PrimaryGeneratedColumn()
    readonly identifier: number;

    @Column({ nullable: false })
    @IsInt()
    year: number;

    @Column("jsonb", { nullable: false })
    data: ApplicationSchema;

    @OneToOne(
        () => Hacker,
        (hacker: Hacker) => hacker.application
    )
    @JoinColumn({ name: "identifier" })
    hacker: Hacker;
}

export default Application;
