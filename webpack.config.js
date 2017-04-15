/**
 * Created by arhexanon on 15-4-17.
 */

const path = require('path');

const config = {

    entry: './src/index.js',
    output: {
        path:  path.resolve(__dirname, 'build'),
        filename: 'bundle.js'
    }
};

module.exports = config;
