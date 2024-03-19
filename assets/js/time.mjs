export class Time {
    FIXED_UPDATE_INTERVAL = 1000 / 60;

    constructor () {
        this.lastTime = 0;
        this.dt = 0;
        this.time = 0;
        this.fps = 0;

        this.lastFixedUpdate = 0;

        this.updateEvents = [];
        this.fixedUpdateEvents = [];

        this.stopped = true;

        this.update();
    }

    start () {
        this.stopped = false;
    }
    
    // every frame
    update () {
        this.time = performance.now();
        this.dt = (this.time - this.lastTime) / 1000;
        this.fps = 1 / this.deltaTime;
        this.lastTime = this.time;

        // stop execution
        if (this.stopped) {
            requestAnimationFrame(() => this.update());
            return;
        }

        while (this.time - this.lastFixedUpdate > this.FIXED_UPDATE_INTERVAL) {
            this.lastFixedUpdate += this.FIXED_UPDATE_INTERVAL;
            this.fixedUpdate();
        }

        for (const event of this.updateEvents) {
            event(this.dt);
        }
        
        requestAnimationFrame(() => this.update());
        
    }

    // 60 times per second
    fixedUpdate () {
        for (const event of this.fixedUpdateEvents) {
            event(this.deltaTime);
        }
    }
    
    get deltaTime () {
        return this.dt;
    }

    subscribe (event, mode) {
        if (mode === Time.mode.fixed) {
            this.fixedUpdateEvents.push(event);
        } else if (mode === Time.mode.update) {
            this.updateEvents.push(event);
        } else {
            console.error('Invalid mode for event subscription.');
        }
    }

    static mode = {
        fixed: 0,
        update: 1
    }

}