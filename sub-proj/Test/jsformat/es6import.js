import defaultExport from "module-name";
import * as name from "module-name";
import { export1 } from "module-name";
import { export1 as alias1 } from "module-name";
import { default as alias } from "module-name";
import { export1, export2 } from "module-name";
import { 
  export1, 
  export2 as alias2, alias3
} from "module-name";
import { "string name" as alias } from "module-name";
import defaultExport, { export1, export2 } from "module-name";

const {
  ipcRenderer,
  webUtils
} = require('electron');
const remote = require('@electron/remote');

import defaultExport, * as name from "module-name";
import "module-name";

import("./data.json", { with: { type: "json" } });

(async () => {
  if (somethingIsTrue) {
    const {
      default: myDefault,
      foo,
      bar,
    } = await import("/modules/my-module.js");
  }
})();

Promise.all(
  Array.from({ length: 10 }).map((_, index) => import(`/modules/module-${index}.js`),
  ),
).then((modules) => modules.forEach((module) => module.load()));

const main = document.querySelector("main");
for (const link of document.querySelectorAll("nav > a")) {
  link.addEventListener("click", (e) => {
    e.preventDefault();

    import("/modules/my-module.js")
      .then((module) => {
        module.loadPageInto(main);
      })
      .catch((err) => {
        main.textContent = err.message;
      });
  });
}

let myModule;

if (typeof window === "undefined") {
  myModule = await import("module-used-on-server");
} else {
  myModule = await import("module-used-in-browser");
}

