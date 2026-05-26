// Flood Fill — scanline algorithm
// Operates on a Uint8ClampedArray (canvas ImageData.data, RGBA).
// Treats any pixel where R, G, B all < boundaryThreshold as a wall (line-art).

export const BOUNDARY_THRESHOLD = 64;

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

  if (tR < threshold && tG < threshold && tB < threshold) return 0; // boundary
  if (tR === newR && tG === newG && tB === newB) return 0;          // already same

  let filled = 0;
  const stack: number[] = [startX, startY];

  while (stack.length > 0) {
    const y = stack.pop()!;
    let x = stack.pop()!;

    while (x >= 0 && matches(data, (y * width + x) * 4, tR, tG, tB, threshold)) x--;
    x++;

    let spanAbove = false;
    let spanBelow = false;

    while (x < width && matches(data, (y * width + x) * 4, tR, tG, tB, threshold)) {
      const idx = (y * width + x) * 4;
      data[idx]     = newR;
      data[idx + 1] = newG;
      data[idx + 2] = newB;
      data[idx + 3] = 255;
      filled++;

      if (y > 0) {
        const above = matches(data, ((y - 1) * width + x) * 4, tR, tG, tB, threshold);
        if (above && !spanAbove) { stack.push(x, y - 1); spanAbove = true; }
        else if (!above) spanAbove = false;
      }
      if (y < height - 1) {
        const below = matches(data, ((y + 1) * width + x) * 4, tR, tG, tB, threshold);
        if (below && !spanBelow) { stack.push(x, y + 1); spanBelow = true; }
        else if (!below) spanBelow = false;
      }
      x++;
    }
  }

  return filled;
}

function matches(
  data: Uint8ClampedArray,
  idx:  number,
  tR:   number, tG: number, tB: number,
  threshold: number,
): boolean {
  const r = data[idx];
  const g = data[idx + 1];
  const b = data[idx + 2];
  if (r < threshold && g < threshold && b < threshold) return false; // wall
  return r === tR && g === tG && b === tB;
}
