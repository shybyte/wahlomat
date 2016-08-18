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
import * as compression from 'compression';
import {isVoteValid} from './validate-vote';

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
  console.log('Init routes...');

  app.set('trust proxy', 'loopback');
  app.use(compression());
  app.use(bodyParser.json());

  await db.init();
  stats.init();

  app.post('/vote', (req, res) => {
    const vote: Vote = req.body;
    if (isVoteValid(vote)) {
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
    } else {
      console.log('Invalid vote', vote);
    }
    res.json({});
  });

  app.get('/stats', (_req, res) => {
    res.set('Cache-Control', 'max-age=' + 1);
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
