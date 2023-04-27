import Invitation from "@app/models/invitation.model";
import { autoInjectable, singleton } from "tsyringe";
import { DeleteResult, getRepository, Repository } from "typeorm";
import jwt from "jsonwebtoken";

@autoInjectable()
@singleton()
export class InvitationService {
    private readonly invitationRepository: Repository<Invitation>;

    constructor() {
        this.invitationRepository = getRepository(Invitation);
    }

    public async find() {
        return await this.invitationRepository.find();
    }

    public async save(invitation: Invitation) {
        return await this.invitationRepository.save(invitation);
    }

    public async delete(email: string): Promise<DeleteResult> {
        return await this.invitationRepository.delete(email);
    }

    public async findByIdentifier(
        email: string
    ): Promise<Invitation | undefined> {
        return await this.invitationRepository.findOne(email);
    }

    public generateLink(
        route: string,
        token: string,
        accountType: string
    ): string {
        return `${process.env.FRONTEND_ADDRESS}/${route}?token=${token}&accountType=${accountType}`;
    }

    public generateToken(invitation: Invitation) {
        return jwt.sign(
            invitation,
            process.env.JWT_INVITE_SECRET ?? "default",
            {
                expiresIn: "1 week"
            }
        );
    }
}
