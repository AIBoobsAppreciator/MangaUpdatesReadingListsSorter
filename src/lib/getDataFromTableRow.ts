import type { RowData } from "../types";

const parseIntOrNull = (str?: string) =>
  str ? parseInt(str, 10) ?? null : null;

export const getDataFromTableRow = (row: HTMLDivElement): RowData => {
  const linkDiv: HTMLAnchorElement | null = row.querySelector("a");
  const volDiv: HTMLAnchorElement | null =
    row.querySelector("a[title*=Volume]");
  const chapDiv: HTMLAnchorElement | null =
    row.querySelector("a[title*=Chapter]");
  const ratingDiv: HTMLAnchorElement | null =
    row.querySelector("a[title*=Rating]");
  const avgDiv: HTMLAnchorElement | null =
    row.querySelector(".text:last-child");
  return {
    name: linkDiv?.innerText,
    link: linkDiv?.href,
    rating: parseIntOrNull(ratingDiv?.innerText),
    average: parseIntOrNull(avgDiv?.innerText),
    progress: {
      vols: parseIntOrNull(volDiv?.innerText?.slice(2)),
      chaps: parseIntOrNull(chapDiv?.innerText?.slice(2)),
    },
  };
};
