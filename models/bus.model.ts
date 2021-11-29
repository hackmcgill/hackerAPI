import { Entity, BaseEntity, Column, ManyToOne, JoinColumn, PrimaryGeneratedColumn } from "typeorm";
import Hacker from "./hacker.model";

interface OriginSchema {
    country: string;
    region: string; // Province or State
    postal: string;
    city: string;
    addr1: string;
    addr2?: string;
}

@Entity()
class Bus extends BaseEntity {
    @PrimaryGeneratedColumn()
    identifier: number;

    @Column("jsonb", { nullable: false })
    origin: OriginSchema;

    @Column({ nullable: false })
    capacity: number;

    @ManyToOne(() => Hacker)
    @JoinColumn()
    hackers: Hacker[];

    toJSON() {
        return this;
    }
}

export default Bus;
