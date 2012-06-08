/*jslint node: true, nomen: true */

'use strict';

var fs = require('fs'),
    path = require('path'),
    connect = require('connect'),
    browserify = require('browserify'),
    handlebars = require('handlebars');

/**
 * Enable requiring handlebar templates.
 */
require.extensions['.html'] = function (module, file) {
    /*jslint stupid: true */
    var template = handlebars.compile(fs.readFileSync(file, 'utf8'));
    module.exports = function (opts) {
        return template(opts);
    };
};

/**
 * Require the fontend code—must be called after the handlebar extension
 * is setup.
 */
var frontend = require('./lib');

/**
 * Create the HTTP server.
 */
var server = connect.createServer();

/**
 * Browserify—bundles the client side JavaScript & templates
 */
server.use(browserify({
    mount: '/bundle.js',
    require: {
        backbone: 'backbone',
        underscore: 'underscore',
        jquery: 'jquery-browserify'
    },
    watch: true
}).register('.html', function (body, path) {
    /*jslint stupid: true */
    return 'module.exports = ' + handlebars.precompile(
        fs.readFileSync(path, 'utf8')
    ) + ';';
}).addEntry(
    path.resolve(path.join('lib', 'index.js'))
));

/**
 * Load the static files.
 */
server.use(connect['static'](path.resolve('static')));

/**
 * Run the front end application.
 */
server.use(function (req, res) {
    res.end(frontend(req.url));
    //res.end('not found');
});

/**
 * Start the HTTP server.
 */
server.listen(process.env.PORT || 1337);
