import Account from "./account.model";
import { Entity } from "typeorm";

@Entity()
class Volunteer extends Account {}

export default Volunteer;
