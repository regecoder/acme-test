import app from './core/app';
import HTTPServer from './core/http-server';
import config from './core/config';

const { host, port } = config.httpServer;

new HTTPServer(app, port, host).start();
