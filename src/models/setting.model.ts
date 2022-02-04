import { IsString } from "class-validator";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Setting {
    @PrimaryGeneratedColumn()
    identifier: number;

    @Column()
    @IsString()
    key: string;

    @Column()
    @IsString()
    value: string;
}
