import { LABEL_STYLE, ROW_ANIMATION_CSS } from "./constants";
import { getDataFromTableRow, injectStylesOnHead } from "./lib";
import { ControlledSpan } from "./models";
import type { BodyAndRowData } from "./types";

injectStylesOnHead(ROW_ANIMATION_CSS);

const table = document.getElementById("list_table");

if (!table) throw new Error("#list_table not found");

// make table a flexbox
table.style.display = "flex";
table.style.flexDirection = "column";

// parsed table data
const parsedTable = (
  Array.from(table.children) as HTMLDivElement[]
).map<BodyAndRowData>((row) => ({
  body: row,
  data: getDataFromTableRow(row),
}));

// sort table function
const sortTable = (sorter: (a: BodyAndRowData, b: BodyAndRowData) => number) =>
  parsedTable.sort(sorter).forEach((div, idx) => {
    div.body.style.order = idx.toString();
  });

const resetTable = () =>
  parsedTable.forEach((div) => div.body.removeAttribute("style"));

const cSpans = Array.from(
  document.querySelectorAll<HTMLDivElement>("form div.specialtext"),
).map((lbl) => {
  lbl.setAttribute("style", LABEL_STYLE);

  const cSpan = new ControlledSpan();
  lbl.appendChild(cSpan.body);
  lbl.onclick = () => cSpan.toggle();

  return cSpan;
});

const [name, progress, rating, avg] = cSpans;

const resetExcept = (ex: ControlledSpan) =>
  cSpans.forEach((cs) => {
    cs === ex || cs.clearState();
  });

const nameSorter = (a: BodyAndRowData, b: BodyAndRowData) => {
  const aName = a.data.name,
    bName = b.data.name;
  if (aName === null && bName === null) return 0;
  if (bName === null) return -1;
  if (aName === null) return 1;
  return aName!.localeCompare(bName!);
};

name.setOnToggle((state) => {
  resetExcept(name);
  if (state == 1) sortTable(nameSorter);
  else if (state == 2) sortTable((a, b) => nameSorter(b, a));
  else resetTable();
});

const progressSorter = (a: BodyAndRowData, b: BodyAndRowData) => {
  const pa = a.data.progress,
    pb = b.data.progress;
  if (pa === null && pb === null) return 0;
  if (pb === null) return -1;
  if (pa === null) return 1;
  return pa.chaps === pb.chaps ? pb.vols! - pa.vols! : pb.chaps! - pa.chaps!;
};

progress.setOnToggle((state) => {
  resetExcept(progress);
  if (state == 1) sortTable(progressSorter);
  else if (state == 2) sortTable((a, b) => progressSorter(b, a));
  else resetTable();
});

const ratingSorter = (a: BodyAndRowData, b: BodyAndRowData) => {
  const ra = a.data.rating,
    rb = b.data.rating;
  if (ra === null && rb === null) return 0;
  if (rb === null) return -1;
  if (ra === null) return 1;
  return ra - rb;
};

rating.setOnToggle((state) => {
  resetExcept(rating);
  if (state == 1) sortTable(ratingSorter);
  else if (state == 2) sortTable((a, b) => ratingSorter(b, a));
  else resetTable();
});

const avgSorter = (a: BodyAndRowData, b: BodyAndRowData) => {
  const avgA = a.data.average,
    avgB = b.data.average;
  if (avgA === null && avgB === null) return 0;
  if (avgB === null) return -1;
  if (avgA === null) return 1;
  return avgA - avgB;
};

avg.setOnToggle((state) => {
  resetExcept(avg);
  if (state == 1) sortTable(avgSorter);
  else if (state == 2) sortTable((a, b) => avgSorter(b, a));
  else resetTable();
});
