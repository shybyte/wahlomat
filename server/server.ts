/// <reference path="../typings/main/index.d.ts" />

import * as express from 'express';

const app = express();
const port = process.env.PORT || 5000;

app.use(express.static('public'));

app.listen(port, () => {
  console.log('Wahlomat server listening on port %d in %s mode', port, app.settings.env);
});
