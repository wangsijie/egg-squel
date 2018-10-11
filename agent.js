'use strict';

const squel = require('./lib/app');

module.exports = agent => {
  if (agent.config.squel.agent) squel(agent);
};
