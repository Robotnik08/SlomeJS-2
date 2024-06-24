export class Color {
    constructor (r, g, b, a) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }

    toRGBA () {
        return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`;
    }

    copy () {
        return new Color(this.r, this.g, this.b, this.a);
    }

    static get white () {
        return new Color(255, 255, 255, 1);
    }

    static get black () {
        return new Color(0, 0, 0, 1);
    }

    static get red () {
        return new Color(255, 0, 0, 1);
    }

    static get green () {
        return new Color(0, 255, 0, 1);
    }

    static get blue () {
        return new Color(0, 0, 255, 1);
    }

    static get yellow () {
        return new Color(255, 255, 0, 1);
    }

    static get cyan () {
        return new Color(0, 255, 255, 1);
    }

    static get magenta () {
        return new Color(255, 0, 255, 1);
    }

    static get gray () {
        return new Color(128, 128, 128, 1);
    }

    static get clear () {
        return new Color(0, 0, 0, 0);
    }
}