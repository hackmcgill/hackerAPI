import { singleton } from "tsyringe";
import { Connection, getConnection } from "typeorm";

export interface Filter {
    param: string;
    operation: Operation;
    value: string | string[];
}

enum Operation {
    Equal = "=",
    Like = "LIKE",
    In = "IN",
    Limit = "LIMIT",
    Skip = "SKIP",
    OrderBy = "ORDER BY"
}

@singleton()
export class SearchService {
    private readonly connection: Connection;
    constructor() {
        this.connection = getConnection();
    }

    public parseParam(param: string) {
        const path = param.split('.');
        return path[0] + '->' + path.slice(1, path.length - 1).map((s) => `'${s}'`).join('->') + "->>" + `'${path[path.length - 1]}'`;
    }

    public async executeQuery(
        model: string,
        query: Array<Filter>
    ): Promise<Array<unknown>> {
        const metadata = this.connection.getMetadata(model).target;
        const builder = this.connection
            .getRepository(metadata)
            .createQueryBuilder(model)
            .leftJoinAndSelect("hacker.account", "account");

        query.forEach(({ param, operation, value }: Filter) => {
            param = this.parseParam(param);
            switch (operation.toUpperCase()) {
                case Operation.Equal:
                case Operation.In:
                    builder.andWhere(`${param} ${operation} (:...value)`, {
                        value
                    });
                    break;
                case Operation.Like:
                    builder.andWhere(`${param} ${operation} %:value%`, {
                        param,
                        operation,
                        value
                    });
                    break;
                case Operation.Limit:
                    builder.skip(Number.parseInt(value as string));
                    break;
                case Operation.Skip:
                    builder.skip(Number.parseInt(value as string));
                    break;
            }
        });

        return builder.getMany();
    }
}
