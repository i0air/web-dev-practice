const { pow, PI, round } = Math;

export function rr(n: number, d: number = 3) {
  return round(n * pow(10, d)) / pow(10, d);
}

export function deg(a: number) {
  return (a * 180) / PI;
}

export function rad(a: number) {
  return (a * PI) / 180;
}
