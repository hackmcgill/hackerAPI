import { createConnection } from "typeorm";

import { autoInjectable, singleton } from "tsyringe";
import { EnvService } from "@services/env.service";

@autoInjectable()
@singleton()
export class DatabaseService {
    constructor(private readonly envService: EnvService) {}

    public async connect() {
        await createConnection({
            type: "postgres",
            host: this.getDatabaseAttribute("HOST"),
            port: parseInt(this.getDatabaseAttribute("PORT")!),
            username: this.getDatabaseAttribute("USER"),
            password: this.getDatabaseAttribute("PASSPORT"),
            database: this.getDatabaseAttribute("NAME"),
            synchronize: true,
            entities: [__dirname + "/../**/**.model{.ts,.js}"]
        });
    }

    private getDatabaseAttribute(name: string) {
        return this.envService.isDevelopment()
            ? this.envService.get(`DB_${name}_DEV`)
            : this.envService.isProduction()
            ? this.envService.get(`DB_${name}_DEPLOY`)
            : this.envService.get(`DB_${name}_TEST`);
    }
}
