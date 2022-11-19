import { IsEmail } from "class-validator";
import { Column, Entity, ManyToOne, PrimaryColumn } from "typeorm";
import Account from "./account.model";
import { UserType } from "@constants/general.constant";

@Entity()
class Invitation {
  @PrimaryColumn()
  @IsEmail()
  email: string;

  @Column({
    enum: UserType,
    default: UserType.Hacker
  })
  accountType: string;

  @ManyToOne(() => Account)
  inviter: Account;
}

export default Invitation;