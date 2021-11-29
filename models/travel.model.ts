import * as Constants from "../constants/general.constant";
import {
    Entity,
    BaseEntity,
    OneToOne,
    JoinColumn,
    Column,
    PrimaryGeneratedColumn
} from "typeorm";
import Hacker from "./hacker.model";

@Entity()
class Travel extends BaseEntity {
    @PrimaryGeneratedColumn()
    identifier: number;

    @OneToOne(() => Hacker)
    @JoinColumn()
    hacker: Hacker;

    @Column({
        enum: Constants.TRAVEL_STATUSES,
        nullable: false,
        default: "None"
    })
    status: String;

    @Column({ nullable: false })
    request: number;

    @Column({ default: 0 })
    offer: number;

    toJSON() {
        return this;
    }
}

export default Travel;
