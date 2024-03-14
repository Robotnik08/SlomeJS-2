import { Vector2, Vector3 } from './vector.mjs';

export class Canvas {
    constructor (size) {
        this.canvas = document.createElement('canvas');
        this.canvas.width = size.x;
        this.canvas.height = size.y;
        this.context = this.canvas.getContext('2d');
        document.body.appendChild(this.canvas);

        this.autoResize = false;
        window.addEventListener('resize', () => {
            this.fitScreen();
        });
    }

    fitScreen () {
        if (this.autoResize) {
            this.width = window.innerWidth;
            this.height = window.innerHeight;
        }
    }

    resize (size) {
        this.width = size.x;
        this.height = size.y;
    }

    clear () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawSprite (sprite, position, size, rotation = false) {

        if (rotation) {
            this.context.save();
            this.context.translate(position.x, position.y);
            this.context.rotate(rotation * Math.PI / 180);
            this.context.drawImage(
                sprite.image,
                -size.x / 2,
                -size.y / 2,
                size.x,
                size.y
            );
            this.context.restore();
            return;
        }

        this.context.drawImage(
            sprite.image,
            position.x -size.x / 2,
            position.y -size.y / 2,
            size.x,
            size.y
        );
    }

    drawText (text, position, size, color, rotation = false) {

        if (rotation) {
            this.context.save();
            this.context.translate(position.x, position.y);
            this.context.rotate(rotation * Math.PI / 180);
            this.context.font = `${size}px sans-serif`;
            this.context.fillStyle = text.color.toRGBA();
            this.context.fillText(text, 0, 0);
            this.context.restore();
            return;
        }

        this.context.font = `${size}px sans-serif`;
        this.context.fillStyle = color.toRGBA();
        this.context.fillText(text, position.x, position.y);
    }

    drawCircle (position, radius, color, rotation = false) {

        if (rotation) {
            this.context.save();
            this.context.translate(position.x, position.y);
            this.context.rotate(rotation * Math.PI / 180);
            this.context.beginPath();
            this.context.arc(0, 0, radius, 0, Math.PI * 2);
            this.context.fillStyle = color.toRGBA();
            this.context.fill();
            this.context.restore();
            return;
        }

        this.context.beginPath();
        this.context.arc(position.x, position.y, radius, 0, Math.PI * 2);
        this.context.fillStyle = color.toRGBA();
        this.context.fill();
    }

    drawRect (position, size, color, rotation = false) {

        if (rotation) {
            this.context.save();
            this.context.translate(position.x, position.y);
            this.context.rotate(rotation * Math.PI / 180);
            this.context.fillStyle = color.toRGBA();
            this.context.fillRect(-size.x / 2, -size.y / 2, size.x, size.y);
            this.context.restore();
            return;
        }

        this.context.fillStyle = color.toRGBA();
        this.context.fillRect(position.x, position.y, size.x, size.y);
    }

    get size () {
        return new Vector2(this.canvas.width, this.canvas.height);
    }

    get center () {
        return this.size.divide(2);
    }

    get left () {
        return 0;
    }

    get right () {
        return this.canvas.width;
    }

    get top () {
        return 0;
    }

    get bottom () {
        return this.canvas.height;
    }

    get mouse () {
        return new Vector2(Input.mouse.x, Input.mouse.y);
    }

    get width () {
        return this.canvas.width;
    }

    get height () {
        return this.canvas.height;
    }

    set width (width) {
        this.canvas.width = width;
    }

    set height (height) {
        this.canvas.height = height;
    }


}