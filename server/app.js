const express = require('express');
const fs = require('fs');
const app = express();

app.use((req, res, next) => {
const log = [
    (req.get('user-agent') || '').replace(/,/g, ''),
    new Date().toISOString(),
    req.method,
    req.originalUrl,
    `HTTP/${req.httpVersion}`,
    200
  ].join(',') + '\n';

  console.log(log);

  fs.appendFile('log.csv', log, (err) => {
    if (err) return next(err);
    next();
  });
});

app.get('/', (req, res) => {
    res.send('ok');

});

app.get('/logs', (req, res) => {
    fs.readFile('log.csv', 'utf8', (err, data) => {
        if (err) return next(err);

        const rows = data.trim().split('\n');
        const headers = rows.shift().trim().split(',');

        const logs = rows.map(row => {
            const values = row.trim().split(',');
            const entry = {};

        headers.forEach((header, index) => {
            entry[header] = values[index];
        });

        return entry;
    });

    res.json(logs);
  });

});

module.exports = app;
