import mysql from 'mysql2';
import { config } from './config.mjs';

export class DataBase {
    constructor () {
        this.host = config.database.host;
        this.user = config.database.user;
        this.password = config.database.password;
        this.database = config.database.database_name;
        this.port = config.database.port;

        this.connection = mysql.createConnection({
            host: this.host,
            user: this.user,
            password: this.password,
            database: this.database,
            port: this.port
        });
    }

    query (query) {
        return new Promise((resolve, reject) => {
            this.connection.query(query, (error, results, fields) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });
    }

    close () {
        this.connection.end();
    }

    static connect (host, user, password, database) {
        return new DataBase(host, user, password, database);
    }

    async execute (query) {
        return await this.query(query);
    }

    static async query (host, user, password, database, query) {
        const db = new DataBase(host, user, password, database);
        const results = await db.query(query);
        db.close();
        return results;
    }
}