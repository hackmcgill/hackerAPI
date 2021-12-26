import { singleton } from "tsyringe";
import { Connection, getConnection } from "typeorm";

@singleton()
export class SearchService {
    constructor(private readonly connection: Connection = getConnection()) {}

    public executeQuery(
        model: any,
        query: Array<any>,
        page: number,
        limit: number,
        sort: string,
        sort_by: string,
        shouldExpand: boolean = false
    ) {
        var builder = this.connection
            .createQueryBuilder()
            .relation(model)
            .select();
        for (const element in query) {
            const {
                parameter,
                value,
                operation
            }: { parameter: any; value: any; operation: string } = query[
                element
            ];

            //TODO: Ensure santitized input for operation and value?
            builder = builder.where(`:${parameter}${operation}${value}`, {
                parameter,
                value
            });
        }

        //TODO: Implement sorting by ascending, descending.
        return builder
            .limit(limit)
            .skip(limit * page)
            .getMany();
    }
}
