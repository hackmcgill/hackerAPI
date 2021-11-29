import * as Constants from "../constants/general.constant";
import { Column, Entity, JoinColumn, OneToMany, ManyToOne } from "typeorm";
import Account from "./account.model";
import Application from "./application.model";
import Team from "./team.model";

@Entity()
class Hacker extends Account {
    @Column({
        enum: Constants.HACKER_STATUSES,
        nullable: false,
        default: "None"
    })
    status: string;

    @OneToMany(
        () => Application,
        (application) => application.hacker
    )
    @JoinColumn()
    applications: Application[];

    //TODO: Implement Team One To One
    @ManyToOne(
        () => Team,
        (team) => team.hackers
    )
    team: Team;

    toJSON() {
        return this;
    }

    isApplicationComplete() {
        const application = this.applications[this.applications.length - 1];
        if (application == null) return false;

        const portfolioDone = !!application.data.general.URL.resume;
        const jobInterestDone = !!application.data.general.jobInterest;
        const questionOneDone = !!application.data.shortAnswer.question1;
        const questionTwoDone = !!application.data.shortAnswer.question2;
        const previousHackathonsDone = !!application.data.shortAnswer
            .previousHackathons;
        const attendancePreferenceDone = !!application.data.accommodation
            .attendancePreference;

        return (
            portfolioDone &&
            jobInterestDone &&
            questionOneDone &&
            questionTwoDone &&
            previousHackathonsDone &&
            attendancePreferenceDone
        );
    }
}

export default Hacker;
