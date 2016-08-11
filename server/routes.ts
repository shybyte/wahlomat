/// <reference path="../typings/main/index.d.ts" />
/// <reference path="../typings/main/globals/body-parser/index.d.ts" />

import * as express from 'express';
import {Express, Response} from 'express';
import * as bodyParser from 'body-parser';
import * as db from './db';
import * as stats from './stats';
import * as exphbs from 'express-handlebars';
import * as shortid from 'shortid';

function renderWithClientToken(template: string, res: Response) {
  res.render(template, {
    clientToken: shortid.generate(),
    layout: false,
  });
}


export async function initRoutes(app: Express) {
  app.use(bodyParser.json());

  console.log('Init routes');

  await db.init();
  stats.init();

  app.post('/vote', (req, res) => {
    const vote = req.body;
    stats.addVote(vote);
    db.saveVote(vote);
    res.json({});
  });

  app.get('/stats', (_req, res) => {
    res.json(stats.getStats());
  });

  app.use(express.static('public'));

  app.set('views', './server/views');
  app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
  app.set('view engine', 'handlebars');

  app.get(/^\/$|\/index.html/, (_req, res) => {
    renderWithClientToken('index', res);
  });

  app.get('/iframe.html', (_req, res) => {
    renderWithClientToken('iframe', res);
  });

};
