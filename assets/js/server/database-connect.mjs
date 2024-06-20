import mysql from 'mysql2';
import { database_config } from '../../../config.js';

export class DataBase {
    constructor () {
        this.host = database_config.host;
        this.user = database_config.user;
        this.password = database_config.password;
        this.database = database_config.database_name;
        this.port = database_config.port;

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