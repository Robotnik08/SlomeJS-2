import { Vector2 } from "./vector.mjs";

export class Input {
    constructor (clickChecker = null) {
        this.mouse = Vector2.zero;
        this.scroll = 0;
        this.keys = {};
        this.keys_down = {};

        this.override_event_defaults = {
            'F1': true,
            'F2': true,
            'F3': true,
            'F4': true,
            'F5': true,
            'F6': true,
            'F7': true,
            'F8': true,
            'F9': true,
            'F10': true,
        };
        
        window.addEventListener('mousemove', event => {
            this.mouse.x = event.clientX;
            this.mouse.y = event.clientY;
        });

        window.addEventListener('wheel', event => {
            this.scroll = event.deltaY;
        });

        window.addEventListener('keydown', event => {
            if (this.override_event_defaults[event.code])
                event.preventDefault();
            this.keys[event.code] = true;

            if (!event.repeat)
                this.keys_down[event.code] = true;
        });


        window.addEventListener('keyup', event => {
            this.keys[event.code] = false;
        });

        (clickChecker ?? window).addEventListener('contextmenu', event => {
            event.preventDefault();
        });

        (clickChecker ?? window).addEventListener('mousedown', event => {
            this.keys[event.button] = true;
            this.keys_down[event.button] = true;
        });

        window.addEventListener('mouseup', event => {
            this.keys[event.button] = false;
        });
    }

    getKey (key) {
        return this.keys[key] ? true : false;
    }

    getKeyDown (key) {
        return this.keys_down[key] ? true : false;
    }

    get mousePosition () {
        return this.mouse;
    }

    static get leftMouseButton () {
        return 0;
    }

    static get rightMouseButton () {
        return 2;
    }

    static get middleMouseButton () {
        return 1;
    }
}