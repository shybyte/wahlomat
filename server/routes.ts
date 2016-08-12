/// <reference path="../typings/main/index.d.ts" />
/// <reference path="../typings/main/globals/body-parser/index.d.ts" />

import * as express from 'express';
import {Express, Request, Response} from 'express';
import {Vote} from '../app/app-state-interfaces';
import {extend} from '../app/utils';
import * as bodyParser from 'body-parser';
import * as db from './db';
import * as stats from './stats';
import * as exphbs from 'express-handlebars';
import * as shortid from 'shortid';

function renderWithClientToken(template: string, req: Request, res: Response) {
  const token = shortid.generate();
  db.saveToken({
    date: new Date(),
    token,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });
  res.render(template, {
    clientToken: token,
    layout: false,
  });
}


export async function initRoutes(app: Express) {
  app.set('trust proxy', 'loopback');
  app.use(bodyParser.json());

  console.log('Init routes');

  await db.init();
  stats.init();

  app.post('/vote', (req, res) => {
    const vote: Vote = req.body;
    stats.addVote(vote);
    db.saveVote(extend(vote, {
      date: new Date(),
      ip: req.ip,
      userAgent: req.get('User-Agent')
    })).then(oldVote => {
      if (oldVote) {
        stats.removeVote(oldVote);
      }
    });
    res.json({});
  });

  app.get('/stats', (_req, res) => {
    res.json(stats.getStats());
  });

  app.use(express.static('public'));

  app.set('views', './server/views');
  app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
  app.set('view engine', 'handlebars');

  app.get(/^\/$|\/index.html/, (req, res) => {
    renderWithClientToken('index', req, res);
  });

  app.get('/iframe.html', (req, res) => {
    renderWithClientToken('iframe', req, res);
  });

};
