import { createInterface } from 'readline';

export class Console {
    constructor () {
        this.commands = {};
        
        this.rl = createInterface({
            input: process.stdin,
            output: process.stdout
        });

        this.rl.on('line', (input) => {
            const [command, ...args] = input.split(' ');
            this.runCommand(command, ...args);
        });

        this.addCommand('help', () => {
            console.log('Commands:');
            for (const command in this.commands) {
                console.log(`- ${command}`);
            }
        });

        this.addCommand('clear', () => {
            console.clear();
        });
    }

    addCommand (name, callback) {
        this.commands[name] = callback;
        this.commands = Object.fromEntries(Object.entries(this.commands).sort());
    }

    runCommand (name, ...args) {
        if (this.commands[name]) {
            this.commands[name](...args);
        } else {
            console.log(`Command '${name}' not found.`);
        }
    }
}