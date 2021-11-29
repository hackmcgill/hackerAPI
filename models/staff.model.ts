import Account from "./account.model";
import { Entity } from "typeorm";

@Entity()
class Staff extends Account {}

export default Staff;
