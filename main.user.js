// ==UserScript==
// @name         MangaUpdates Reading Lists Advanced Sort
// @version      1.2.0
// @author       AIBoobsAppreciator
// @icon         https://raw.githubusercontent.com/AIBoobsAppreciator/MangaUpdatesReadingListsSorter/main/images/icon-128.png
// @description  Improves your reading lists sorting experience on MangaUpdates.
// @match        https://www.mangaupdates.com/mylist.html
// @updateURL    https://raw.githubusercontent.com/AIBoobsAppreciator/MangaUpdatesReadingListsSorter/main/update.user.js
// @downloadURL  https://raw.githubusercontent.com/AIBoobsAppreciator/MangaUpdatesReadingListsSorter/main/main.user.js
// ==/UserScript==
(() => {
  // src/constants.ts
  var ROW_ANIMATION_CSS = `.row { transition: order 0.5s ease-in-out; }
.row:nth-child(odd) { transition-delay: 0.1s; }`;
  var LABEL_STYLE = `display: flex;
flex-direction: row;
align-items: center;
justify-content: space-between;
padding-right: 1em;
`;

  // src/lib/injectStylesOnHead.ts
  var injectStylesOnHead = (css) => {
    const head = document.head || document.getElementsByTagName("head")[0];
    const style = document.createElement("style");
    head.appendChild(style);
    style.appendChild(document.createTextNode(css));
  };
  // src/lib/getDataFromTableRow.ts
  var parseIntOrNull = (str) => (str ? parseInt(str, 10) ?? null : null);
  var getDataFromTableRow = (row) => {
    const linkDiv = row.querySelector("a");
    const volDiv = row.querySelector("a[title*=Volume]");
    const chapDiv = row.querySelector("a[title*=Chapter]");
    const ratingDiv = row.querySelector("a[title*=Rating]");
    const avgDiv = row.querySelector(".text:last-child");
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
  // src/models/ControlledSpan.ts
  var states = ["", "\u2193", "\u2191"];

  class ControlledSpan {
    state = 0;
    onToggle = (state) => {};
    body = document.createElement("span");
    setOnToggle(action) {
      this.onToggle = action;
    }
    clearState() {
      this.state = 0;
      this.body.innerText = states[0];
    }
    toggle() {
      this.state = (this.state + 1) % 3;
      this.body.innerText = states[this.state];
      this.onToggle(this.state);
    }
  }
  // src/index.ts
  injectStylesOnHead(ROW_ANIMATION_CSS);
  var table = document.getElementById("list_table");
  if (!table) throw new Error("#list_table not found");
  table.style.display = "flex";
  table.style.flexDirection = "column";
  var parsedTable = Array.from(table.children).map((row) => ({
    body: row,
    data: getDataFromTableRow(row),
  }));
  var sortTable = (sorter) =>
    parsedTable.sort(sorter).forEach((div, idx) => {
      div.body.style.order = idx.toString();
    });
  var resetTable = () =>
    parsedTable.forEach((div) => div.body.removeAttribute("style"));
  var cSpans = Array.from(
    document.querySelectorAll("form div.specialtext"),
  ).map((lbl) => {
    lbl.setAttribute("style", LABEL_STYLE);
    const cSpan = new ControlledSpan();
    lbl.appendChild(cSpan.body);
    lbl.onclick = () => cSpan.toggle();
    return cSpan;
  });
  var [name, progress, rating, avg] = cSpans;
  var resetExcept = (ex) =>
    cSpans.forEach((cs) => {
      cs === ex || cs.clearState();
    });
  var nameSorter = (a, b) => {
    const aName = a.data.name,
      bName = b.data.name;
    if (aName === null && bName === null) return 0;
    if (bName === null) return -1;
    if (aName === null) return 1;
    return aName.localeCompare(bName);
  };
  name.setOnToggle((state) => {
    resetExcept(name);
    if (state == 1) sortTable(nameSorter);
    else if (state == 2) sortTable((a, b) => nameSorter(b, a));
    else resetTable();
  });
  var progressSorter = (a, b) => {
    const pa = a.data.progress,
      pb = b.data.progress;
    if (pa === null && pb === null) return 0;
    if (pb === null) return -1;
    if (pa === null) return 1;
    return pa.chaps === pb.chaps ? pb.vols - pa.vols : pb.chaps - pa.chaps;
  };
  progress.setOnToggle((state) => {
    resetExcept(progress);
    if (state == 1) sortTable(progressSorter);
    else if (state == 2) sortTable((a, b) => progressSorter(b, a));
    else resetTable();
  });
  var ratingSorter = (a, b) => {
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
  var avgSorter = (a, b) => {
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
})();
