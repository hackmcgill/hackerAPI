import { Entity, BaseEntity, Column, PrimaryGeneratedColumn } from "typeorm";
const Constants = require("../constants/general.constant");

export interface RouteSchema {
    uri: string;
    requestType: string;
    // TODO: Above type is a enum: Object.values(Constants.REQUEST_TYPES)}
}

/**
 * The name is descriptive of the role
 * Each role may have different routes, where route parameters in the uri are replaced with :self or :all
 */
@Entity()
class Role extends BaseEntity {
    @PrimaryGeneratedColumn()
    identifier: number;

    // The name should be something like "hacker", or "sponsor".
    // For roles with singular routes, the name of the role will be the name of the route plus the api route
    // For example, "getSelfAccount"
    @Column({ unique: true, nullable: false })
    name: string;

    @Column("jsonb", { nullable: false })
    routes: RouteSchema[];

    toJSON() {
        return this;
    }
}

export default Role;
