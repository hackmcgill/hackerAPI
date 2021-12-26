import * as Constants from "../constants/general.constant";
import { Entity, BaseEntity, OneToOne, JoinColumn, Column } from "typeorm";
import Hacker from "./hacker.model";
import * as GeneralConstants from "../constants/general.constant";
import { IsEnum, IsInt, IsNumber, IsString, Max, Min } from "class-validator";

@Entity()
class Travel extends BaseEntity {
    @OneToOne(() => Hacker, { primary: true })
    @JoinColumn()
    hacker: Hacker;

    @Column({
        enum: GeneralConstants.TravelStatus,
        nullable: false,
        default: "None"
    })
    @IsEnum(GeneralConstants.TravelStatus)
    status: String;

    @Column({ nullable: false })
    @IsNumber()
    @Min(0)
    @Max(300)
    request: number;

    @Column({ default: 0 })
    @IsNumber()
    @Min(0)
    @Max(300)
    offer: number;
}

export default Travel;
