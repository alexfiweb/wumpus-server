var app = require('./src/gameRoutes');

const sls = require('serverless-http')

module.exports.server = sls(app)