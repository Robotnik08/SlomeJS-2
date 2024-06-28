import { World } from "../world.mjs";
import { DataBase } from "./database-connect.mjs";

const main_db = DataBase.connect('localhost', 'root', '', 'slomejs');

export class SaveManager {
    constructor () {
    }

    async saveWorld (world, name) {
        const checkQuery = `SELECT * FROM worlds WHERE name='${name}'`;
        await main_db.execute(checkQuery).then((results) => {
            if (results.length == 0) {
                const query = `INSERT INTO worlds (name, data) VALUES ('${name}', '${JSON.stringify(world.getJSON())}')`;
                // return id after insert
                main_db.execute(query).then((results) => {
                    // get account id
                    const query = `SELECT * FROM accounts WHERE name='${name}'`;
                    main_db.execute(query).then((accounts) => {
                        const id = accounts[0].id;
                        // link world to account
                        this.linkWorld(results.insertId, id);
                    });
                });
            } else {
                const query = `UPDATE worlds SET name='${name}', data='${JSON.stringify(world.getJSON())}' WHERE name='${name}'`;
                main_db.execute(query);
            }
        })
    }

    async loadWorld (name) {
        const query = `SELECT * FROM worlds WHERE name = '${name}'`;
        const result = await main_db.execute(query);

        if (result.length === 0) {
            return null;
        }
        const json = result[0].data.toString().slice(1, -1);
        return World.fromJSON(json, result[0].id);
    }

    async linkWorld (id, owner) {
        const query = `INSERT INTO accounts_worlds (world_id, account_id, whitelist) VALUES ('${id}', '${owner}', "")`;
        main_db.execute(query);
    }

    async getWorld (owner) {
        const query = `SELECT * FROM accounts_worlds WHERE account_id = '${owner}'`;
        const results = await main_db.execute(query);
        return results.length === 1 ? results[0] : results;
    }

    async getOwner (id) {
        const query = `SELECT * FROM accounts_worlds WHERE world_id = '${id}'`;
        const results = await main_db.execute(query);
        return results.length === 1 ? results[0] : results;
    }
}