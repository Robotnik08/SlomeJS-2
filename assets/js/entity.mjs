import { Vector2 } from "./vector.mjs";
import { HitBox } from "./hitbox.mjs";
import { EPSILON } from "./constants.mjs";

export class Entity {
    constructor (position, sprite, size = null) {
        this.position = position;
        this.projectedPosition = position;
        this.sprite = sprite;

        this.hasPhysics = false;

        this.velocity = Vector2.zero;

        this.is_grounded = false;

        this.size = size ? size : Vector2.one;
    }

    fixedUpdate () {
        // 60 times per second
    }

    update (dt) {
        // interpolate position based on delta time
        this.projectedPosition = this.position;// Vector2.interpolate(this.projectedPosition, this.position, 10 * dt);
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
            if (world.getTile(new Vector2(checkPos.x, checkPos.y + this.velocity.y / 60))) {
                this.velocity.y = 0;
                this.position.y = Math.round(checkPos.y + this.velocity.y / 60) - check.y + (EPSILON * (check.y > 0 ? -1 : 1) /*to prevent getting stuck*/);
                checkPos = this.position.add(check);
                if (check.y > 0 && !groundedCheck) groundedCheck = true;
            }
            if (world.getTile(new Vector2(checkPos.x + this.velocity.x / 60, checkPos.y))) {
                this.velocity.x = 0;
                this.position.x = Math.round(checkPos.x + this.velocity.x / 60) - check.x + (EPSILON * (check.x > 0 ? -1 : 1) /*to prevent getting stuck*/);
            }
        }
        this.is_grounded = groundedCheck;

        this.position = this.position.add(this.velocity.divide(60));

        // const pass = {x: true, y: true};




        // check top left

        // let checkPosition = this.position.add(this.hitbox.topLeft);
        // let tryCheckPosition = tryposition.add(this.hitbox.topLeft);

        // if (world.getTile(new Vector2 (checkPosition.x, tryCheckPosition.y)) && pass.y) {
        //     this.velocity.y = 0;
        //     this.position.y = Math.round(this.position.y) - ((0.5 - EPSILON) - Math.abs(this.hitbox.topLeft.y));
        //     pass.y = false;
        // }

        // if (world.getTile(new Vector2 (tryposition.add(this.hitbox.topLeft).x, this.position.add(this.hitbox.topLeft).y)) && pass.x) {
        //     this.velocity.x = 0;
        //     this.position.x = Math.round(this.position.x) + ((0.5 - EPSILON) - Math.abs(this.hitbox.topLeft.x));
        //     pass.x = false;
        // }

        // check top right
        // if (world.getTile(new Vector2 (tryposition.add(this.hitbox.topRight).x, this.position.add(this.hitbox.topLeft).y)) && pass.x) {
        //     this.velocity.x = 0;
        //     this.position.x = Math.round(this.position.x) + ((0.5 - EPSILON) - Math.abs(this.hitbox.topRight.x));
        //     pass.x = false;
        // }
        // if (world.getTile(new Vector2 (this.position.add(this.hitbox.topRight).x, tryposition.add(this.hitbox.topLeft).y)) && pass.y) {
        //     this.velocity.y = 0;
        //     this.position.y = Math.round(this.position.y) + ((0.5 - EPSILON) - Math.abs(this.hitbox.topRight.y));
        //     pass.y = false;
        // }

        // // check bottom left
        // if (world.getTile(new Vector2 (tryposition.add(this.hitbox.bottomLeft).x, this.position.add(this.hitbox.bottomLeft).y)) && pass.x) {
        //     this.velocity.x = 0;
        //     this.position.x = Math.round(this.position.x) - ((0.5 - EPSILON) - Math.abs(this.hitbox.bottomLeft.x));
        //     pass.x = false;
        // }
        // if (world.getTile(new Vector2 (this.position.add(this.hitbox.bottomLeft).x, tryposition.add(this.hitbox.bottomLeft).y)) && pass.y) {
        //     this.velocity.y = 0;
        //     this.position.y = Math.round(this.position.y) + ((0.5 - EPSILON) - Math.abs(this.hitbox.bottomLeft.y));
        //     pass.y = false;
        // }

        // // check bottom right
        // if (world.getTile(new Vector2 (tryposition.add(this.hitbox.bottomRight).x, this.position.add(this.hitbox.bottomRight).y)) && pass.x) {
        //     this.velocity.x = 0;
        //     this.position.x = Math.round(this.position.x) - ((0.5 - EPSILON) - Math.abs(this.hitbox.bottomRight.x));
        //     pass.x = false;
        // }
        // if (world.getTile(new Vector2 (this.position.add(this.hitbox.bottomRight).x, tryposition.add(this.hitbox.bottomRight).y)) && pass.y) {
        //     this.velocity.y = 0;
        //     this.position.y = Math.round(this.position.y) - ((0.5 - EPSILON) - Math.abs(this.hitbox.bottomRight.y));
        //     pass.y = false;
        // }


        // if (pass.x) this.position.x = tryposition.x;
        // if (pass.y) this.position.y = tryposition.y;
    }
}