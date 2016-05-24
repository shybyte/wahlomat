/// <reference path="../typings/main/index.d.ts" />
/// <reference path="../typings/main/globals/body-parser/index.d.ts" />

import * as express from 'express';
import {initRoutes} from './routes';

const app = express();
const port = process.env.PORT || 5000;

initRoutes(app);

app.listen(port, () => {
  console.log('Wahlomat server listening on port %d in %s mode.', port, app.settings.env);
  console.log('StartTime: ', new Date());
});
