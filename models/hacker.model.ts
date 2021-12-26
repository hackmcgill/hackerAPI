import * as Constants from "../constants/general.constant";
import {
    Column,
    Entity,
    JoinColumn,
    OneToMany,
    ManyToOne,
    OneToOne
} from "typeorm";
import Account from "./account.model";
import Application, { ApplicationSchema } from "./application.model";
import Team from "./team.model";

@Entity()
class Hacker {
    @OneToOne(() => Account, { primary: true })
    @JoinColumn()
    account: Account;

    @Column({
        enum: Constants.HACKER_STATUSES,
        nullable: false,
        default: "None"
    })
    status: string;

    @Column("jsonb")
    application: ApplicationSchema;

    //TODO: Implement Team One To One
    @ManyToOne(
        () => Team,
        (team) => team.hackers
    )
    team?: Team;

    toJSON() {
        return this;
    }

    isApplicationComplete() {
        if (this.application == null) return false;

        const portfolioDone = !!this.application.general.URL.resume;
        const jobInterestDone = !!this.application.general.jobInterest;
        const questionOneDone = !!this.application.shortAnswer.question1;
        const questionTwoDone = !!this.application.shortAnswer.question2;
        const previousHackathonsDone = !!this.application.shortAnswer
            .previousHackathons;
        const attendancePreferenceDone = !!this.application.accommodation
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
