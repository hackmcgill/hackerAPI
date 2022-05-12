import { singleton } from "tsyringe";
import { Connection, getConnection } from "typeorm";

export interface Filter {
    parameter: string;
    operation: Operation;
    value: string;
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

    public async executeQuery(
        model: string,
        query: Array<Filter>
    ): Promise<Array<unknown>> {
        const metadata = this.connection.getMetadata(model).target;
        const builder = this.connection
            .getRepository(metadata)
            .createQueryBuilder(model)
            .loadAllRelationIds();

        query.forEach(({ parameter, operation, value }: Filter) => {
            switch (operation) {
                case Operation.Equal:
                case Operation.In:
                    builder.andWhere(`:parameter :operation :value`, {
                        parameter: parameter,
                        operation: operation,
                        value: value
                    });
                    break;
                case Operation.Like:
                    builder.andWhere(`:parameter :operation %:value%`, {
                        parameter: parameter,
                        operation: operation,
                        value: value
                    });
                    break;
                case Operation.Limit:
                    builder.skip(Number.parseInt(value));
                    break;
                case Operation.Skip:
                    builder.skip(Number.parseInt(value));
                    break;
            }
        });

        return builder.getMany();
    }
}
