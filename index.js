"use strict";

require(`./lib/${process.argv[2]}.js`)(process.argv.slice(3))
    .then(() => process.exit(0))
    .catch((err) => {
        process.stderr.write(err.message);
        process.exit(1);
    });
