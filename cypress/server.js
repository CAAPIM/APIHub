const express = require('express');
const path = require('path');

exports.start = () => {
    return new Promise((resolve, reject) => {
        const server = express();
        server.use(
            '/',
            express.static(path.join(__dirname, '../packages/example/build'))
        );

        server.on('error', err => {
            if (!server.listening) {
                return reject(err);
            }

            throw err;
        });

        const listeningServer = server.listen(process.env.PORT || 3000);

        // Give some time to enable error catching before resolving (for EADDRINUSE error)
        setTimeout(() => {
            resolve(listeningServer);
        }, 1000);
    });
};
