/// <reference path="../typings/main/index.d.ts" />
/// <reference path="../typings/main/globals/body-parser/index.d.ts" />

import * as express from 'express';
import * as db from './db';
import * as bodyParser from 'body-parser';

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());

app.use(express.static('public'));

app.post('/vote', (req, res) => {
  db.saveVote(req.body);
  res.json({});
});

app.listen(port, () => {
  console.log('Wahlomat server listening on port %d in %s mode', port, app.settings.env);
  console.log('Time: ', new Date());
});
