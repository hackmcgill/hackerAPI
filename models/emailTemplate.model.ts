import { Entity, BaseEntity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
class EmailTemplate extends BaseEntity {
    @PrimaryGeneratedColumn()
    identifier: number;

    @Column({ nullable: false })
    name: string;

    @Column({ nullable: false })
    content: string;

    toJSON() {
        return this;
    }
}

export default EmailTemplate;
