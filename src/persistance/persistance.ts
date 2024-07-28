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
        console.log(query, args);
        const [results] = await pool.execute(query, args);
        return (results as T[])[0] as T;
    }

    static async persistEntity<T>(className: string, entity: Partial<T>): Promise<any> {
        const columns = Object.keys(entity);
        const values = Object.values(entity);

        const inserts = '(' + columns.join(', ') + ')';
        const insertCount = '(' + values.map(() => '?') + ')';

        const query = 'INSERT INTO ' + className + inserts + ' VALUES ' + insertCount;
        return await pool.execute(query, values);
    }
}