import { readFileSync } from "fs";
import { autoInjectable } from "tsyringe";
import { EnvService } from "./env.service";
import { createTransport } from "nodemailer";
import { compile } from "handlebars";
import mjml2html from "mjml";
import { LoggerService } from "./logger.service";

@autoInjectable()
export class EmailService {
    protected readonly mailer;

    constructor(
        private readonly envService: EnvService,
        private readonly loggerService: LoggerService
    ) {
        this.mailer = createTransport({
            host: this.getEmailAttribute("HOST"),
            port: parseInt(this.getEmailAttribute("PORT")!),
            auth: {
                user: this.getEmailAttribute("USERNAME"),
                pass: this.getEmailAttribute("PASSWORD")
            }
        });
        this.mailer
            .verify()
            .catch((error) =>
                this.loggerService
                    .getLogger()
                    .error(`Failed to connect to SMTP server. Error: ${error}`)
            );
    }

    public async send({ ...args }: any, { ...context }: any, callback?: any) {
        args.from = this.envService.get("NO_REPLY_EMAIL");
        if (args.html)
            args.html = compile(
                mjml2html(readFileSync(args.html, "utf-8")).html
            )(context);
        await this.mailer
            .sendMail({
                ...args,
                from: this.envService.get("NO_REPLY_EMAIL")
            })
            .catch((error) => callback(error));
    }

    private getEmailAttribute(name: string) {
        return this.envService.isDevelopment()
            ? this.envService.get(`EMAIL_${name}_DEV`)
            : this.envService.isProduction()
            ? this.envService.get(`EMAIL_${name}_DEPLOY`)
            : this.envService.get(`EMAIL_${name}_TEST`);
    }
}
