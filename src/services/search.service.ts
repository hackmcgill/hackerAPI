import { singleton } from "tsyringe";
import { Connection, getConnection } from "typeorm";

@singleton()
export class SearchService {
    private readonly connection: Connection;
    constructor() {
        this.connection = getConnection();
    }

    public async executeQuery(
        model: string,
        query: any
    ): Promise<Array<unknown>> {
        const metadata = this.connection.getMetadata(model).target;
        let builder = this.connection
            .getRepository(metadata)
            .createQueryBuilder(model)
            .loadAllRelationIds();

        for (const element in query) {
            const {
                param,
                value,
                operation
            }: { param: any; value: any; operation: string } = query[element];

            //TODO: Ensure santitized input for operation and value?
            builder = builder.andWhere(`${param} ${operation} :value`, {
                value: value
            });
        }

        //TODO: Implement limits (limit()), skipping (skip()), and sorting by ascending, descending (orderBy()).
        return builder.getMany();
    }
}
