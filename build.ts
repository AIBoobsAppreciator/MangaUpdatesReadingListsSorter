import * as prettier from "prettier";

console.log("Running build...");
await Bun.build({
  entrypoints: ["./src/index.ts"],
  outdir: "./dist",
  target: "browser",
});

// builds extension
console.log("Building extension...");

await Bun.$`web-ext build --config=config.mjs`;

// builds main.user.js
console.log("Building main.user.js...");

const UserScriptHeaders = `\
// ==UserScript==
// @name         MangaUpdates Reading Lists Advanced Sort
// @version      ${require("./manifest.json").version}
// @author       AIBoobsAppreciator
// @icon         https://raw.githubusercontent.com/AIBoobsAppreciator/MangaUpdatesReadingListsSorter/main/images/icon-128.png
// @description  Improves your reading lists sorting experience on MangaUpdates.
// @match        https://www.mangaupdates.com/mylist.html
// @updateURL    https://raw.githubusercontent.com/AIBoobsAppreciator/MangaUpdatesReadingListsSorter/main/update.user.js
// @downloadURL  https://raw.githubusercontent.com/AIBoobsAppreciator/MangaUpdatesReadingListsSorter/main/main.user.js
// ==/UserScript==
`;

const BrowserScriptBody = await Bun.file("./dist/index.js").text();

const UserScriptBody = `\
(() => {
  ${BrowserScriptBody}
})();
`;

const UserScript = await prettier.format(UserScriptHeaders + UserScriptBody, {
  parser: "babel",
});

await Bun.write("update.user.js", UserScriptHeaders);
await Bun.write("main.user.js", UserScript);
