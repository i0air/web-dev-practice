import { Container, FederatedPointerEvent, Sprite, Texture, type ColorSource } from "pixi.js";

export module Panel {
    export interface Props {
        width: number;
        height: number;
        x: number;
        y: number;
        background?: ColorSource;
        alpha?: number;
    }
}


export class Panel extends Container {
    bg: Sprite;
    folded: boolean = false;
    initHeight: number;

    constructor(props: Panel.Props) {
        super();
        this.x = props.x;
        this.y = props.y;
        this.bg = new Sprite({
            texture: Texture.WHITE,
            width: props.width,
            height: props.height,
            alpha: props.alpha,
            tint: props.background
        })
        this.initHeight = props.height;
        this.addChild(this.bg);
        this.bg.interactive = true;
        this.bg.addEventListener("click", this.clickHandler);
    }

    clickHandler = (ev: FederatedPointerEvent) => {
        this.folded = !this.folded;
        if (this.folded) {
            this.height = 32;
        } else {
            this.height = this.initHeight;
        }
    }
}