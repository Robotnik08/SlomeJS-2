import { Vector2 } from "./vector.mjs";
import { HitBox } from "./hitbox.mjs";
import { EPSILON } from "./constants.mjs";
import { Sprites } from "./sprites.mjs";
import { Color } from "./color.mjs";

const localEntitySprites = new Sprites();

let global_id = 1000;

export class Entity {

    // base constructor for all entities, MUST be called by all subclasses
    constructor (position, sprite, size = null, id = null) {
        this.position = position;
        this.projectedPosition = position;
        this.sprite = sprite;
        this.usesSprite = true;
        this.color = Color.white;

        this.hasPhysics = false;

        this.velocity = Vector2.zero;

        this.is_grounded = false;

        this.size = size ?? Vector2.one;
        
        this.id = id || global_id++;

        this.destroyed = false;
    }

    fixedUpdate () {
        // 60 times per second
    }

    update (dt) {
        // interpolate position based on delta time
        this.projectedPosition = Vector2.interpolate(this.projectedPosition, this.position, 100 * dt);
    }

    physics (world) {
        if (!this.hasPhysics) return;
        

        this.velocity.x *= 0.8;
        this.velocity.y += world.gravity / 60;
        
        if (!this.hitbox) {
            return;
        }

        let groundedCheck = false;
        for (const check of this.hitbox.list) {
            let checkPos = this.position.add(check);
            if (this.getSolid(world.getTile(new Vector2(checkPos.x, checkPos.y + this.velocity.y / 60)))) {
                this.velocity.y = 0;
                this.position.y = Math.round(checkPos.y + this.velocity.y / 60) - check.y + (EPSILON * (check.y > 0 ? -1 : 1) /*to prevent getting stuck*/);
                checkPos = this.position.add(check);
                if (check.y > 0 && !groundedCheck) groundedCheck = true;
            }
            if (this.getSolid(world.getTile(new Vector2(checkPos.x + this.velocity.x / 60, checkPos.y)))) {
                this.velocity.x = 0;
                this.position.x = Math.round(checkPos.x + this.velocity.x / 60) - check.x + (EPSILON * (check.x > 0 ? -1 : 1) /*to prevent getting stuck*/);
            }
        }
        this.is_grounded = groundedCheck;

        this.position = this.position.add(this.velocity.divide(60));
    }

    getSolid (tile) {
        return tile && localEntitySprites.getCollision(tile);
    }

    destroy () {
        // remove entity from world
        this.destroyed = true;
    }
}