// Flood Fill — scanline algorithm with color tolerance.
// Works on RGBA Uint8ClampedArray from canvas.getImageData().
//
// Two-rule predicate (more forgiving than exact-color match, so non-thresholded
// pencil sketches with anti-aliased gray edges still fill correctly):
//   1) A "wall" pixel = brightness below WALL_THRESHOLD → never filled or crossed
//   2) A "fillable" pixel = not a wall AND brightness-similar to the start pixel
//      (so subsequent fills don't cross already-painted regions of different color)

export const BOUNDARY_THRESHOLD = 90;   // brightness 0-255; line-art pixels darker than this = wall
const TOLERANCE = 220;                  // max sum-of-channel diff from start for "same region"

export function floodFill(
  data:    Uint8ClampedArray,
  width:   number,
  height:  number,
  startX:  number,
  startY:  number,
  newR:    number,
  newG:    number,
  newB:    number,
  threshold = BOUNDARY_THRESHOLD,
): number {
  startX = Math.round(startX);
  startY = Math.round(startY);
  if (startX < 0 || startX >= width || startY < 0 || startY >= height) return 0;

  const startIdx = (startY * width + startX) * 4;
  const tR = data[startIdx];
  const tG = data[startIdx + 1];
  const tB = data[startIdx + 2];

  if (isWall(tR, tG, tB, threshold)) return 0;
  if (tR === newR && tG === newG && tB === newB) return 0;

  let filled = 0;
  const stack: number[] = [startX, startY];

  while (stack.length > 0) {
    const y = stack.pop()!;
    let x = stack.pop()!;

    while (x >= 0 && matches(data, (y * width + x) * 4, tR, tG, tB, newR, newG, newB, threshold)) x--;
    x++;

    let spanAbove = false;
    let spanBelow = false;

    while (x < width && matches(data, (y * width + x) * 4, tR, tG, tB, newR, newG, newB, threshold)) {
      const idx = (y * width + x) * 4;
      data[idx]     = newR;
      data[idx + 1] = newG;
      data[idx + 2] = newB;
      data[idx + 3] = 255;
      filled++;

      if (y > 0) {
        const above = matches(data, ((y - 1) * width + x) * 4, tR, tG, tB, newR, newG, newB, threshold);
        if (above && !spanAbove) { stack.push(x, y - 1); spanAbove = true; }
        else if (!above) spanAbove = false;
      }
      if (y < height - 1) {
        const below = matches(data, ((y + 1) * width + x) * 4, tR, tG, tB, newR, newG, newB, threshold);
        if (below && !spanBelow) { stack.push(x, y + 1); spanBelow = true; }
        else if (!below) spanBelow = false;
      }
      x++;
    }
  }

  return filled;
}

function isWall(r: number, g: number, b: number, threshold: number): boolean {
  return r < threshold && g < threshold && b < threshold;
}

function matches(
  data: Uint8ClampedArray,
  idx:  number,
  tR: number, tG: number, tB: number,
  newR: number, newG: number, newB: number,
  threshold: number,
): boolean {
  const r = data[idx];
  const g = data[idx + 1];
  const b = data[idx + 2];
  if (isWall(r, g, b, threshold)) return false;
  // Skip already-painted-with-new-color so loop terminates and we don't repaint.
  if (r === newR && g === newG && b === newB) return false;
  // Color tolerance from the start pixel so the fill stops at differently-painted regions.
  const diff = Math.abs(r - tR) + Math.abs(g - tG) + Math.abs(b - tB);
  return diff < TOLERANCE;
}
