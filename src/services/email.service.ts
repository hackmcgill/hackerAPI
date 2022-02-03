import { readFileSync } from "fs";
import { autoInjectable } from "tsyringe";
import { createTransport } from "nodemailer";
import { compile } from "handlebars";
import mjml2html from "mjml";
import { LoggerService } from "@services/logger.service";
import nodemailerSgTransport from "nodemailer-sendgrid";

@autoInjectable()
export class EmailService {
    protected readonly mailer;

    constructor(private readonly loggerService: LoggerService) {
        this.mailer = createTransport(
            process.env.NODE_ENV !== "deployment"
                ? {
                      host: this.getEmailAttribute("HOST"),
                      port: parseInt(this.getEmailAttribute("PORT")!),
                      auth: {
                          user: this.getEmailAttribute("USERNAME"),
                          pass: this.getEmailAttribute("PASSWORD")
                      }
                  }
                : nodemailerSgTransport({
                      apiKey: this.getEmailAttribute("SENDGRID_API_KEY")!
                  })
        );
        this.mailer
            .verify()
            .catch((error) =>
                this.loggerService
                    .getLogger()
                    .error(`Failed to connect to SMTP server. ${error}`)
            );
    }

    public async send(
        { ...args }: any,
        { ...context }: any,
        callback?: any
    ): Promise<void> {
        args.from = process.env.NO_REPLY_EMAIL;
        if (args.html)
            args.html = compile(
                mjml2html(readFileSync(args.html, "utf-8")).html
            )(context);
        await this.mailer
            .sendMail({
                ...args,
                from: process.env.NO_REPLY_EMAIL
            })
            .catch((error) => callback(error));
    }

    private getEmailAttribute(name: string): string | undefined {
        return process.env[`EMAIL_${name}`];
    }
}
