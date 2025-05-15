import * as seedRandom from "seedrandom";

export function mandelbrot(cx: number, cy: number, iters: number) {
  let zx = 0;
  let zy = 0;

  for (let i = 0; i < iters; i++) {
    if (zx * zx + zy * zy >= 4) return i;
    let zxTemp = zx;
    zx = zx * zx - zy * zy + cx;
    zy = 2 * zxTemp * zy + cy;
  }

  return iters;
}

export function findPointOnEdgeOfMandelbrot(random: seedRandom.PRNG) {
  while (true) {
    const x = random() * 4.0 - 2.0;
    const y = random() * 4.0 - 2.0;

    const v = mandelbrot(x, y, 64);
    if (v > 32 && v < 64) {
      return { x, y };
    }
  }
}
