import passport from "passport";
import { Strategy } from "passport-local";
import { autoInjectable, singleton } from "tsyringe";
import Account from "../models/account.model";
import { AccountService } from "../services/account.service";

@autoInjectable()
@singleton()
export class EmailAndPasswordStrategy extends Strategy {
    constructor(private readonly accountService: AccountService) {
        super(
            {
                usernameField: "email",
                passwordField: "password"
            },
            (
                email: string,
                password: string,
                done: (error: any, user?: any) => void
            ) => this.verify(email, password, done)
        );

        passport.serializeUser(
            (user: Account, done: (error: any, identifier?: number) => void) =>
                done(null, user.identifier)
        );

        passport.deserializeUser(
            async (
                identifier: number,
                done: (
                    error: any,
                    user?: false | Express.User | null | undefined
                ) => void
            ) => {
                await this.accountService
                    .findByIdentifier(identifier)
                    .then((user) => done(null, user))
                    .catch((reason) => done(reason));
            }
        );
    }

    async verify(
        email: string,
        password: string,
        done: (error: any, user?: any) => void
    ) {
        await this.accountService
            .getAccountIfValid(email.toLowerCase(), password)
            .then((account) => {
                if (account) done(null, account);
                else done(null, false);
            })
            .catch((reason) => {
                done(reason, false);
            });
    }
}
