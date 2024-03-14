import { Vector2 } from "./vector.mjs";

export class Input {
    constructor () {
        this.mouse = Vector2.zero;
        this.keys = {};
        
        window.addEventListener('mousemove', event => {
            this.mouse.x = event.clientX;
            this.mouse.y = event.clientY;
        });

        window.addEventListener('keydown', event => {
            this.keys[event.code] = true;
        });

        window.addEventListener('keyup', event => {
            this.keys[event.code] = false;
        });
    }

    getKey (key) {
        return this.keys[key] ? true : false;
    }

    get mousePosition () {
        return this.mouse;
    }

}