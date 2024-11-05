export module RectangleGenerator {
  export interface Options {
    i: number;
    size?: number;
    gap?: { x: number; y: number };
    center?: { x: number; y: number };
  }
}

export class RectangleGenerator {
  cx = 0; // 圈中心x
  cy = 0; // 圈中心y
  gx = 100; // x轴间隔
  gy = 100; // y轴间隔

  private m = 0; // 圈数
  private n = 0; // 总节点数
  private i = 0; // 总序号
  private c = 0; // 当前节点总数
  private j = 0; // 圈序号
  private x = 0;
  private y = 0;

  constructor(opt: RectangleGenerator.Options = { i: 0 }) {
    this.i = opt.i;
    if (opt.center) {
      this.cx = opt.center.x;
      this.cy = opt.center.y;
    }
    if (opt.gap) {
      this.gx = opt.gap.x;
      this.gy = opt.gap.y;
    }
  }

  next() {
    const { floor, pow } = Math;

    if (this.i === this.n) {
      this.j = this.i - this.n;
      this.n = pow(2 * this.m + 1, 2);
      this.c = this.n - (this.m > 0 ? pow(2 * (this.m - 1) + 1, 2) : 0);
      this.x = this.cx - this.gx * this.m;
      this.y = this.cy - this.gy * this.m;
      this.m++;
    }

    const l = 2 * (this.m - 1); // 边长
    if (l > 0) {
      const p = floor(this.j / l); // 边标识

      const px = (p + 1) % 2; //是否横边 1,0,1,0
      const py = p % 2; //是否竖边 0,1,0,1

      const ax = (1 - p) * px; // 横边绘制方向 1,0,-1,0
      const ay = (2 - p) * py; // 纵边绘制方向 0,1,0,-1

      this.x = this.x + px * ax * this.gx;
      this.y = this.y + py * ay * this.gy;
    }

    this.i++;
    this.j++;

    return { idx: this.i - 1, x: this.x, y: this.y, m: this.m - 1 };
  }

  reset() {
    this.m = 0;
    this.n = 0;
    this.i = 0;
    this.c = 0;
    this.j = 0;
    this.x = 0;
    this.y = 0;
  }
}
