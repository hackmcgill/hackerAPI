import Invitation from "@app/models/invitation.model";
import { autoInjectable, singleton } from "tsyringe";
import { getRepository, Repository } from "typeorm";
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

  public generateLink(route: string, token: string): string {
    return `${process.env.FRONTEND_ADDRESS}/${route}?token=${token}`;
}

  public generateToken(invitation: Invitation) {
    return jwt.sign(invitation, process.env.JWT_ ?? "default", { expiresIn: "1 week" });
  }
}