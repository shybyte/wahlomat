/// <reference path="../typings/main/index.d.ts" />
/// <reference path="../typings/main/globals/body-parser/index.d.ts" />

import * as express from 'express';
import {Express} from 'express';
import * as bodyParser from 'body-parser';
import * as db from './db';


export function initRoutes(app: Express) {
  app.use(bodyParser.json());

  app.use(express.static('public'));

  app.post('/vote', (req, res) => {
    db.saveVote(req.body);
    res.json({});
  });
};
