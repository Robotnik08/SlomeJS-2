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

export class Game {
    constructor () {
        this.canvas = new Canvas(new Vector2(800, 600));
        this.canvas.autoResize = true;
        this.canvas.fitScreen();


        this.camera = new Vector2(0, 0);
        this.zoom = 14; // 2 = 50% zoom, 1 game unit is half the height of the screen

        this.zoomBounds = new Vector2(4, 20);

        this.entities = [];

        this.world = new World();

        this.entities.push(new Player(Vector2.zero, 'slome', new Vector2 (0.88, 0.88)));
        // this.entities[0].position = this.world.getSpawn();
        this.entities[0].projectedPosition = this.entities[0].position;

        this.selectedTile = Vector2.zero;
        this.selectedType = 1;

        time.subscribe((dt) => {
            if (!this.world.loaded) return;

            this.draw(this.camera);
            this.entities.forEach(entity => {
                if (entity.move) entity.move(input, dt);
                if (entity.update) entity.update(dt);
            });

            this.camera = this.entities[0].projectedPosition;

            const aspect_ratio = this.canvas.size.x / this.canvas.size.y;

            this.selectedTile = new Vector2 ((input.mousePosition.x / (this.canvas.height * aspect_ratio) * this.zoom * aspect_ratio) - (this.zoom * aspect_ratio / 2), (input.mousePosition.y / this.canvas.height * this.zoom) - (this.zoom / 2));
            this.selectedTile = this.selectedTile.add(this.camera).subtract(new Vector2(0.5, 0.5)).round();

            if (input.getKey('Minus')) {
                this.zoom *= 1.01;
                if (this.zoom > this.zoomBounds.y) this.zoom = this.zoomBounds.y;
            }
            if (input.getKey('Equal')) {
                this.zoom *= 0.99;
                if (this.zoom < this.zoomBounds.x) this.zoom = this.zoomBounds.x;
            }

            if (input.getKeyDown('F3')) {
                this.debug = !this.debug;
            }

            if (input.getKeyDown(Input.leftMouseButton) && this.world.getTile(this.selectedTile) === 0 && this.checkIfTileCollider(this.selectedTile) && this.world.checkPlacement(this.selectedTile)) {
                this.world.setTile(this.selectedTile, this.selectedType);
            }

            if (input.getKeyDown(Input.rightMouseButton)) {
                this.world.setTile(this.selectedTile, this.selectedType, true);
            }


            input.keys_down = {};
        }, Time.mode.update);

        time.subscribe(() => {
            if (!this.world.loaded) return;

            this.entities.forEach(entity => {
                if (entity.physics) entity.physics(this.world);
                if (entity.fixedUpdate) entity.fixedUpdate();
            });
        }, Time.mode.fixed);

        time.start();
    }

    draw (camera = Vector2.zero) {

        const aspect_ratio = this.canvas.size.x / this.canvas.size.y;
        
        let camera_size = new Vector2(this.canvas.size.y * aspect_ratio, this.canvas.size.y);

        const unit_camera_size = new Vector2(this.zoom * aspect_ratio, this.zoom);

        // clear canvas
        this.canvas.clear();

        // convert camera to screen space
        let camera_pixel = camera.multiply(this.canvas.height * (1/this.zoom));

        // center camera
        camera_pixel = camera_pixel.subtract(this.canvas.size.divide(2));
        
        // draw world
        for (let x = Math.max(0, camera.x - Math.round(unit_camera_size.x / 2 + 2)); x < Math.min(this.world.size.x, camera.x + Math.round(unit_camera_size.x / 2 + 2)); x++) {
            for (let y = Math.max(0, camera.y - Math.round(unit_camera_size.y / 2 + 2)); y < Math.min(this.world.size.y, camera.y + Math.round(unit_camera_size.y / 2 + 2)); y++) {
                const position = new Vector2(x, y);

                if (!this.world.getTile(position)) {
                    if (!this.world.getTile(position, true)) continue;

                    const sprite = sprites.getTile(this.world.getTile(position, true), true);
                    this.canvas.drawSprite(sprite, position.multiply(this.canvas.height * (1/this.zoom)).subtract(camera_pixel), new Vector2(this.canvas.height * (1/this.zoom) + 1, this.canvas.height * (1/this.zoom) + 1), false, false);
                    continue;
                };

                const sprite = sprites.getTile(this.world.getTile(position));
                this.canvas.drawSprite(sprite, position.multiply(this.canvas.height * (1/this.zoom)).subtract(camera_pixel), new Vector2(this.canvas.height * (1/this.zoom) + 1, this.canvas.height * (1/this.zoom) + 1), false, false);
            }
        }

        // draw selected tile
        this.canvas.drawRect(this.selectedTile.multiply(this.canvas.height * (1/this.zoom)).subtract(camera_pixel), new Vector2(this.canvas.height * (1/this.zoom) + 1, this.canvas.height * (1/this.zoom) + 1), new Color(255, 255, 255, 0.5));

        for (const entity of this.entities) {
            const sprite = sprites.getSprite(entity.sprite);
            let position = entity.projectedPosition.multiply(this.canvas.height * (1/this.zoom));
            position = position.subtract(camera_pixel);

            this.canvas.drawSprite(sprite, position, entity.size.multiply(this.canvas.height * (1/this.zoom)), 0);
        }

        const debug_text = document.getElementById('debug');
        debug_text.innerHTML = '';

        if (this.debug) {

            debug_text.innerHTML += 'FPS: ' + time.fps + '<br>';
            debug_text.innerHTML += 'Position: ' + this.entities[0].projectedPosition.toString() + '<br>';
            debug_text.innerHTML += 'Zoom: ' + this.zoom + '<br>';
            debug_text.innerHTML += 'Entities: ' + this.entities.length + '<br>';
            debug_text.innerHTML += 'Selected Tile: ' + this.selectedTile.toString() + '<br>';
        }
    }

    checkIfTileCollider (position) {
        for (const entity of this.entities) {
            if (entity.hitbox) {
                for (const check of entity.hitbox.list) {
                    if (check.add(entity.position).floor().equals(position)) {
                        return false;
                    }
                }
            }
        }
        return true;
    }
}