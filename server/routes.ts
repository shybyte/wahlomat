/// <reference path="../typings/main/index.d.ts" />
/// <reference path="../typings/main/globals/body-parser/index.d.ts" />

import * as express from 'express';
import {Express} from 'express';
import * as bodyParser from 'body-parser';
import * as db from './db';
import * as stats from './stats';


export async function initRoutes(app: Express) {
  app.use(bodyParser.json());

  app.use(express.static('public'));

  await db.init();
  stats.init();

  app.post('/vote', (req, res) => {
    const vote = req.body;
    stats.addVote(vote);
    db.saveVote(vote);
    res.json({});
  });

  app.get('/stats', (req, res) => {
    res.json(stats.getStats());
  });

};
