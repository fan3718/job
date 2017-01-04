/*eslint no-console:0 */
'use strict';
require('core-js/fn/object/assign');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const config = require('./webpack.config');
const open = require('open');

new WebpackDevServer(webpack(config), config.devServer)
.listen(config.port, '127.0.0.1', (err) => {
  if (err) {
    console.log(err);
  }
  console.log('Listening at localhost:' + config.port);
  console.log('Opening your system browser...');
  open('http://localhost:' + config.port + '?exerId=1169&gradeId=d0c001da-2767-3b4d-8b4e-9bde90384775&ts=1482388273495&examId=3d087f86-a798-41a3-8685-454c0db2fd4d&sign=034C7D1EC96776C3B34C57966176BD4CEC558728&bookId=1568bb09-0dbb-33c4-9024-6ce6b7c2360d&key=android&subject=16&uid=56554&gradeSeq=41&chapterId=b0f5f9d7-7234-3407-aec0-0a2d73ba4139');
});
