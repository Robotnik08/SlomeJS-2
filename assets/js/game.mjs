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

        this.zoomBounds = new Vector2(4, 40);

        this.entities = [];

        this.world = new World();

        this.entities.push(new Player(Vector2.zero, 'slome', new Vector2 (0.88, 0.88)));
        this.player = this.entities[0];
        // this.entities[0].position = this.world.getSpawn();
        this.player.projectedPosition = this.player.position;

        this.selectedTile = Vector2.zero;

        this.setTile = null;

        this.subscribeTimeEvent((dt) => {
            if (!this.world.loaded) return;

            this.draw(this.camera);
            this.entities.forEach(entity => {
                if (entity.move) entity.move(input, dt);
                if (entity.update) entity.update(dt);
            });

            this.camera = this.player.projectedPosition;

            const aspect_ratio = this.canvas.size.x / this.canvas.size.y;

            this.selectedTile = new Vector2 ((input.mousePosition.x / (this.canvas.height * aspect_ratio) * this.zoom * aspect_ratio) - (this.zoom * aspect_ratio / 2), (input.mousePosition.y / this.canvas.height * this.zoom) - (this.zoom / 2));
            this.selectedTile = this.selectedTile.add(this.camera).subtract(new Vector2(0.5, 0.5)).round();

            this.player.angle = Math.atan2(input.mousePosition.y - this.canvas.height / 2, input.mousePosition.x - this.canvas.width / 2) * 180 / Math.PI;

            if (input.getKey('Minus')) {
                this.zoom *= 1.01;
                if (this.zoom > this.zoomBounds.y) this.zoom = this.zoomBounds.y;
            }
            if (input.getKey('Equal')) {
                this.zoom *= 0.99;
                if (this.zoom < this.zoomBounds.x) this.zoom = this.zoomBounds.x;
            }

            if (input.getKeyDown('LeftControl')) {
                this.player.selectedType = 0;
            }

            
            // hotbarselect
            for (let i = 1; i <= 10; i++) {
                if (input.getKey('Digit' + (i % 10)) && i - 1 <= sprites.max_tile_id) {
                    this.player.selectedType = i - 1;
                }
            }

            if (input.scroll > 0) {
                this.player.selectedType++;
                if (this.player.selectedType > sprites.max_tile_id) this.player.selectedType = 0;
            }
            if (input.scroll < 0) {
                this.player.selectedType--;
                if (this.player.selectedType < 0) this.player.selectedType = sprites.max_tile_id;
            }

            if (input.getKeyDown('F3')) {
                this.debug = !this.debug;
            }

            if (this.player.selectedType) {
                if (input.getKeyDown(Input.leftMouseButton) && this.world.getTile(this.selectedTile) === 0 && this.checkIfTileCollider(this.selectedTile) && this.world.checkPlacement(this.selectedTile)) {
                    this.setTile(this.selectedTile, this.player.selectedType);
                }
                if (input.getKeyDown(Input.rightMouseButton) && this.world.getTile(this.selectedTile, true) === 0 && (this.world.checkPlacement(this.selectedTile, true) || this.world.checkPlacement(this.selectedTile))) {
                    this.setTile(this.selectedTile, this.player.selectedType, true);
                }
            } else if (input.getKeyDown(Input.leftMouseButton)) {
                this.setTile(this.selectedTile, 0, this.world.getTile(this.selectedTile) === 0);
            }

            


            input.keys_down = {};
            input.scroll = 0;
        }, Time.mode.update);

        this.subscribeTimeEvent(() => {
            if (!this.world.loaded) return;

            this.entities.forEach(entity => {
                if (entity.physics) entity.physics(this.world);
                if (entity.fixedUpdate) entity.fixedUpdate();
            });
        }, Time.mode.fixed);

        time.start();
    }

    subscribeTimeEvent (callback, mode = Time.mode.update) {
        time.subscribe(callback, mode);
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
                
                if (!this.world.getTile(position) || sprites.is_transparent[this.world.getTile(position)]) {
                    if (this.world.getTile(position, true)) {
                        const sprite = sprites.getTile(this.world.getTile(position, true), true);
                        this.canvas.drawSprite(sprite, position.multiply(this.canvas.height * (1/this.zoom)).subtract(camera_pixel), new Vector2(this.canvas.height * (1/this.zoom) + 1, this.canvas.height * (1/this.zoom) + 1), false, false);
                    }
                }

                if (this.world.getTile(position)) {
                    const sprite = sprites.getTile(this.world.getTile(position));
                    this.canvas.drawSprite(sprite, position.multiply(this.canvas.height * (1/this.zoom)).subtract(camera_pixel), new Vector2(this.canvas.height * (1/this.zoom) + 1, this.canvas.height * (1/this.zoom) + 1), false, false);
                }

            }
        }

        // draw selected tile
        this.canvas.drawRect(this.selectedTile.multiply(this.canvas.height * (1/this.zoom)).subtract(camera_pixel), new Vector2(this.canvas.height * (1/this.zoom) + 1, this.canvas.height * (1/this.zoom) + 1), new Color(255, 255, 255, 0.5));


        for (let i in this.entities) {
            if (isNaN(i)) continue;
            const entity = this.entities[this.entities.length - i - 1];
            const sprite = sprites.getSprite(entity.sprite);
            let position = entity.projectedPosition.multiply(this.canvas.height * (1/this.zoom));
            position = position.subtract(camera_pixel);

            this.canvas.drawSprite(sprite, position, entity.size.multiply(this.canvas.height * (1/this.zoom)), 0);

            // draw tile in hand
            if (entity.IS_PLAYER || entity.IS_OTHER_PLAYER) {
                const hand_sprite = sprites.getTile(entity.selectedType);
                this.canvas.drawSprite(
                    hand_sprite, 
                    entity.projectedPosition.subtract(new Vector2(0,-0.1)).multiply(this.canvas.height * (1/this.zoom)).subtract(camera_pixel), 
                    entity.size.multiply(this.canvas.height * (1/this.zoom)).multiply(0.47), 
                    entity.angle, 
                    true, 
                    new Vector2 (entity.size.multiply(this.canvas.height * (1/this.zoom)).multiply(0.6).x, 0),
                    Math.abs(entity.angle) > 90,
                );
            }
        }

        this.drawUI();

        const debug_text = document.getElementById('debug');
        debug_text.innerHTML = 'SlomeJS v0.2<br>';

        if (this.debug) {

            debug_text.innerHTML += 'FPS: ' + time.fps + '<br>';
            debug_text.innerHTML += 'Position: ' + this.player.projectedPosition.toString() + '<br>';
            debug_text.innerHTML += 'Zoom: ' + this.zoom + '<br>';
            debug_text.innerHTML += 'Entities: ' + this.entities.length + '<br>';
            debug_text.innerHTML += 'Selected Tile: ' + this.selectedTile.toString() + '<br>';
        }
    }

    drawUI () {
        // selected block
        const sprite = sprites.getTile(this.player.selectedType);
        const size = Vector2.one.multiply(this.canvas.height).divide(10);
        this.canvas.drawSprite(sprite, new Vector2(this.canvas.width - size.x - size.divide(4).x, size.divide(4).y), size, 0, false);

        // hotbar
        const hotbar = sprites.getSprite('hotbar');
        const hotbar_size = hotbar.size.normalize().multiply(this.canvas.height);
        this.canvas.drawSprite(hotbar, new Vector2(this.canvas.width / 2 - hotbar_size.x / 2, this.canvas.height*0.99 - hotbar_size.y), hotbar_size, 0, false);

        const hotbar_start_offset = new Vector2(this.canvas.width / 1.896 - hotbar_size.x / 2, this.canvas.height*0.99 - hotbar_size.y + hotbar_size.y/2);
        // draw each item id in hotbar
        for (let i = 0; i < sprites.max_tile_id + 1; i++) {
            const sprite = sprites.getTile(i);
            const size = Vector2.one.multiply(this.canvas.height).divide(17);
            const position = hotbar_start_offset.add(new Vector2(size.x * i + i * size.x/1.51, 0));
            this.canvas.drawSprite(sprite, position, size, 0, true);

            if (this.player.selectedType % 10 == i) {
                this.canvas.drawSprite(sprites.getSprite('hotbar_select'), position.subtract(size.multiply(1.6).divide(2)), size.multiply(1.57), 0, false)
            }

            // draw hotbar number
            this.canvas.drawText((i + 1) % 10, position.subtract(new Vector2(size.x/1.4, size.y/2.2)), size.y/2.8, Color.white)
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