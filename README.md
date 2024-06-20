# Slome JavaScript Edition

## Version 0.1


## Installation

Make sure you have Node.js installed on your machine. Then run the following command in the root directory of the project:
```bash
npm i
```

Then, to initialize the database, import the `worlds.sql` file into your MySQL database. You can do this by running the following command in the root directory of the project:
```bash
mysql -u <username> -p <database_name> < worlds.sql
```

Finally, for bigger worlds, you must change the `max_allowed_packet` variable in your MySQL configuration file. Make sure it's above 2MB for larger worlds. (might need to be bigger for even larger worlds)<br>

Finally, create edit the `config.json` file in the root directory of the project to match your database configuration.

## Usage

To start the server, run the following command in the root directory of the project:
```bash
npm start
```

The server will start on port 2020 by default. You can change this by editing the `config.js` file in the root directory of the project.
