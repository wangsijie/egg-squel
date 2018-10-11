'use strict';

const squel = require('./lib/app');

module.exports = app => {
  if (app.config.squel.app) squel(app);
};
