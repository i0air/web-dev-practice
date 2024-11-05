export class BeeGenerator {
  options: BeeGenerator.Options;

  constructor(options: Partial<BeeGenerator.Options>) {
    this.options = { ...BeeGenerator.DEFAULT_OPTIONS, ...options };
  }

  next(idx?: number) {
    if (idx !== undefined) this.options.i = idx;
    const { i, r, center } = this.options;
    const angle = (i * 2 * Math.PI) / r;
    const x = center.x + r * Math.cos(angle);
    const y = center.y + r * Math.sin(angle);
    return { x, y };
  }
}

export module BeeGenerator {
  export const DEFAULT_OPTIONS: Options = {
    i: 0,
    r: 100,
    size: 10,
    center: { x: 0, y: 0 },
  };

  export interface Options {
    i: number;
    r: number;
    size: number;
    center: { x: number; y: number };
  }
}
