#!/usr/bin/env node

require(`./lib/${process.argv[2]}.js`)(process.argv.slice(3))
    .then(() => process.exit(0))
    .catch((err) => {
        // process.stderr.write(err.message);
        console.log(err); // eslint-disable-line no-console
        process.exit(1);
    });
