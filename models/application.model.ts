import {
    Entity,
    BaseEntity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn
} from "typeorm";
import Hacker from "./hacker.model";

interface ApplicationSchema {
    general: {
        school: string;
        degree: string;
        fieldOfStudy: string[];
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
        skills: string[];
        //any miscelaneous comments that the user has
        comments: string;
        //"Why do you want to come to our hackathon?"
        question1: string;
        // "Some Q"
        question2: string;
        previousHackathons: number;
    };
    other: {
        ethnicity: string[];
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
class Application extends BaseEntity {
    @PrimaryGeneratedColumn()
    identifier: number;

    @Column({ nullable: false })
    year: number;

    @Column("jsonb", { nullable: false })
    data: ApplicationSchema;

    @ManyToOne(
        () => Hacker,
        (hacker: Hacker) => hacker.applications
    )
    @JoinColumn()
    hacker: Hacker;
}

export default Application;
