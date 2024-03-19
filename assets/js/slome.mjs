import { Canvas } from './canvas.mjs';
import { Input } from './input.mjs';
import { Sprites } from './sprites.mjs';
import { Sprite } from './sprite.mjs';
import { Color } from './color.mjs';
import { Time } from './time.mjs';
import { Vector2, Vector3 } from './vector.mjs';
import { Player } from './player.mjs';
import { World } from './world.mjs';

const time = new Time();
const input = new Input();
const sprites = new Sprites();

export class Slome {
    constructor () {
        this.canvas = new Canvas(new Vector2(800, 600));
        this.canvas.autoResize = true;
        this.canvas.fitScreen();

        this.camera = new Vector2(0, 0);
        this.zoom = 1/10; // 1/2 = 50% zoom, 1 game unit is half the height of the screen

        this.zoomBounds = new Vector2(1/20, 1/4);

        this.entities = [];

        this.world = new World(new Vector2(100, 100));

        this.entities.push(new Player(Vector2.zero, 'slome', new Vector2 (0.83, 0.83)));
        this.entities[0].position = new Vector2(this.world.size.x / 2 + 0.5, this.world.size.y / 2 + 0.5);
        this.entities[0].projectedPosition = this.entities[0].position;

        time.subscribe((dt) => {
            this.draw(this.camera);
            this.entities.forEach(entity => {
                if (entity.move) entity.move(input, dt);
                if (entity.update) entity.update(dt);
            });

            this.camera = this.entities[0].projectedPosition;
            if (input.getKey('Equal')) {
                this.zoom *= 1.01;
                if (this.zoom > this.zoomBounds.y) this.zoom = this.zoomBounds.y;
            }
            if (input.getKey('Minus')) {
                this.zoom *= 0.99;
                if (this.zoom < this.zoomBounds.x) this.zoom = this.zoomBounds.x;
            }
        }, Time.mode.update);

        time.subscribe(() => {
            this.entities.forEach(entity => {
                if (entity.physics) entity.physics(this.world);
                if (entity.fixedUpdate) entity.fixedUpdate();
            });
        }, Time.mode.fixed);

        time.start();
    }

    draw (camera = Vector2.zero) {
        // clear canvas
        this.canvas.clear();

        // convert camera to screen space
        camera = camera.multiply(this.canvas.height * this.zoom);
        // center camera
        camera = camera.subtract(this.canvas.size.divide(2));

        // draw world
        for (let x = 0; x < this.world.size.x; x++) {
            for (let y = 0; y < this.world.size.y; y++) {
                const position = new Vector2(x, y);
                // const sprite = sprites.getSprite(this.world.getTile(position));
                // this.canvas.drawSprite(sprite, position.multiply(this.canvas.height * this.zoom).subtract(camera), new Vector2(this.canvas.height * this.zoom, this.canvas.height * this.zoom), 0);
                
                // black squares for now
                if (this.world.getTile(position)) 
                    this.canvas.drawRect(position.multiply(this.canvas.height * this.zoom).subtract(camera), new Vector2(this.canvas.height * this.zoom + 1, this.canvas.height * this.zoom + 1), Color.black);
            }
        }

        for (const entity of this.entities) {
            const sprite = sprites.getSprite(entity.sprite);
            let position = entity.projectedPosition.multiply(this.canvas.height * this.zoom);
            position = position.subtract(camera);

            this.canvas.drawSprite(sprite, position, entity.size.multiply(this.canvas.height * this.zoom), 0);
        }
    }
}