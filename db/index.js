var pg 			= require('pg');
var connect 	= process.env.DATABASE_URL || 'postgres://postgres:admin@localhost:5432/taralite';

const pool = new pg.Pool(connect);

module.exports = {
  query: (text, params, callback) => {
    const start = Date.now();
    return pool.query(text, params, (err, res) => {
      const duration = Date.now() - start;
      callback(err, res);
    });
  }
}