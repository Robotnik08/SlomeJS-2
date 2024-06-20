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
                main_db.execute(query);
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
        return World.fromJSON(json);
    }
}