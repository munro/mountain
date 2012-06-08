/*jslint browser: true, nomen: true */
'use strict';

//var Backbone = require('backbone');
var $ = require('jquery'),
    _ = require('underscore'),
    Backbone = require('backbone'),
    Self = require('self');

var main = require('./../view/main.html');

if (typeof window !== 'undefined') {
    console.log('browser!', main({}));
} else {
    console.log('node!');
    module.exports = function (url) {
        return main();
    };
}
