'use strict';
const mysql = require('mysql');
const squel = require('squel');

class Client {
  constructor(config) {
    this.config = config;
  }
  async query(str) {
    let queryString = str;
    if (typeof str === 'function') {
      queryString = str(squel).toString();
    }
    const connection = mysql.createConnection(this.config);
    connection.connect();
    try {
      const result = await new Promise((resolve, reject) => {
        connection.query(queryString, (err, rows) => {
          if (err) {
            return reject(err);
          }
          resolve(rows);
        });
      });
      connection.end();
      return result;
    } catch (e) {
      connection.end();
      throw e;
    }
  }
  select(...args) {
    const squelInstance = squel.select(...args);
    const query = this.query.bind(this);
    squelInstance.then = function(resolve, reject) {
      query(this.toString()).then(resolve).catch(reject);
    };
    squelInstance.count = function() {
      this.then = function(onFulfilled) {
        query(this.field('COUNT(*) as count').toString()).then(result => {
          if (result && result.length) {
            onFulfilled(result[0].count);
          }
          onFulfilled(null);
        });
      };
      return this;
    };
    return squelInstance;
  }
  update(...args) {
    const squelInstance = squel.update(...args);
    const query = this.query.bind(this);
    squelInstance.then = function(resolve, reject) {
      query(this.toString()).then(resolve).catch(reject);
    };
    return squelInstance;
  }
  delete(...args) {
    const squelInstance = squel.delete(...args);
    const query = this.query.bind(this);
    squelInstance.then = function(resolve, reject) {
      query(this.toString()).then(resolve).catch(reject);
    };
    return squelInstance;
  }
  insert(...args) {
    const squelInstance = squel.insert(...args);
    const query = this.query.bind(this);
    squelInstance.then = function(resolve, reject) {
      query(this.toString()).then(resolve).catch(reject);
    };
    return squelInstance;
  }
}

module.exports = config => new Client(config);
