import * as fs from "node:fs/promises";

import * as marked from "marked";
import Renderer from "marked-terminal";

marked.setOptions({
    renderer: new Renderer({
        width: 80,
        reflowText: true
    })
});

export default async function loaddoc(toolname, docdir = `./docs/`) {
    const data = await fs.readFile(`${docdir}${toolname}.md`);

    const markdown = data.toString();

    return marked.parse(markdown);
};
