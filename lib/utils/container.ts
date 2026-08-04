/** Стандартный ряд объёмов контейнеров (в литрах). */
const CONTAINER_LADDER = [0.5, 1, 1.5, 2, 3, 5, 7.5, 10, 15, 20, 25];

/** "C1,5" | "С2" (латиница или кириллица) -> 1.5 | 2 */
export function parseContainerVolume(code: string): number | null {
  const match = code.trim().match(/^[CcСс]\s*(\d+(?:[.,]\d+)?)$/);
  if (!match) return null;
  const volume = Number(match[1].replace(",", "."));
  return Number.isFinite(volume) ? volume : null;
}

/** 1.5 -> "1,5" */
export function formatVolume(volume: number): string {
  return String(volume).replace(".", ",");
}

/**
 * Разворачивает значение контейнера с бэка в список вариантов.
 * "C1,5-C2" -> ["C1,5", "C2"], "C2" -> ["C2"].
 * Если формат нераспознан — возвращает исходную строку одним вариантом.
 */
export function parseContainerOptions(container: string): string[] {
  const parts = container.split(/[-–—/]/).map((part) => part.trim()).filter(Boolean);

  const volumes: number[] = [];
  for (const part of parts) {
    const volume = parseContainerVolume(part);
    if (volume === null) return [container];
    volumes.push(volume);
  }

  if (volumes.length === 0) return [container];

  const min = Math.min(...volumes);
  const max = Math.max(...volumes);
  const steps = CONTAINER_LADDER.filter((volume) => volume >= min && volume <= max);
  const values = steps.length > 0 ? steps : volumes;

  return values.map((volume) => `C${formatVolume(volume)}`);
}
