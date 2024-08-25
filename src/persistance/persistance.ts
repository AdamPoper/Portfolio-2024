import mysql2 from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

export const pool = mysql2.createPool({
    host: 'localhost',
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: 'portfolio_2024'
});

export class Persistance {

    static async selectEntitiesByNamedQuery<T>(query: string, args?: Array<any>): Promise<Array<T>> {
        const [results] = await pool.execute(query, args);
        return results as T[];
    }

    static async selectEntityByNamedQuery<T>(query: string, args?: Array<any>): Promise<T> {
        const [results] = await pool.execute(query, args);
        return (results as T[])[0] as T;
    }

    static async selectEntitiesByNamedQueryPaged<T>(query: string, pageSize: number, pageNumber: number, args?: Array<any>): Promise<Array<T>> {
        const [results] = await pool.execute(query, args);
        const start = pageSize * pageNumber;
        const end = start + pageSize;
        return (results as T[]).slice(start, end);
    }

    static async persistEntity<T>(className: string, entity: Partial<T>): Promise<any> {
        const columns = Object.keys(entity);
        const values = Object.values(entity);

        const inserts = '(' + columns.join(', ') + ')';
        const insertCount = '(' + values.map(() => '?') + ')';

        const query = 'INSERT INTO ' + className + inserts + ' VALUES ' + insertCount;
        return await pool.execute(query, values);
    }

    static async persistEntities<T>(className: string, entities: Array<Partial<T>>): Promise<any> {
        if (entities.length === 0) {
            return new Promise((resolve, reject) => {
                resolve('No entities to persist');
            });
        }

        const columns = Object.keys(entities[0]);
        const values = new Array<unknown>();
        entities.forEach(e => {
            const objectValues = Object.values(e);
            values.push(...objectValues);
        })

        const insertColumns = '(' + columns.join(', ') + ')';
        const insertValues = entities.map(e => {
            const objectValues = Object.values(e);
            return '(' + objectValues.map(() => '?') + ')';
        }).toString();

        const query = 'INSERT INTO ' + className + insertColumns + ' VALUES ' + insertValues;
        return await pool.execute(query, values);
    }
}