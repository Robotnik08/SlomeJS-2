import mysql from 'mysql2';

export class DataBase {
    constructor (host, user, password, database) {
        this.host = host;
        this.user = user;
        this.password = password;
        this.database = database;

        this.connection = mysql.createConnection({
            host: this.host,
            user: this.user,
            password: this.password,
            database: this.database
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