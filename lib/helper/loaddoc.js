const fs = require("fs");

const marked = require("marked");
const Renderer = require("marked-terminal");

marked.setOptions({
    renderer: new Renderer({
        width: 80,
        reflowText: true
    })
});

module.exports = async function showDoc(toolname, docdir = "docs/") {
    const data = await new Promise((resolve,reject) => {
        fs.readFile(`${docdir}${toolname}.md`, (err, data) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(data);
            }
        });
    });

    const markdown = data.toString();

    return marked(markdown);
};
