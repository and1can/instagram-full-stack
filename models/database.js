var pg = require('pg');
var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/pixlee';

var client = new pg.Client(connectionString);
client.connect();
var query = client.query('CREATE TABLE test(id SERIAL PRIMARY KEY, text VARCHAR(40) not null, complete BOOLEAN)');
//var query = client.query('CREATE TABLE images(img bytea)');
query.on('end', function() { client.end(); }); 