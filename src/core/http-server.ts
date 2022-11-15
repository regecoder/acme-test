import http from 'http';
import express from 'express';

export default class HTTPServer {
  private app: express.Application;
  private port: number;
  private host: string;
  private server: http.Server;

  constructor(app: express.Application, port: number, host: string) {
    this.app = app;
    this.port = port;
    this.host = host;

    this.server = http.createServer(this.app);
  }

  start() {
    this.server.listen(this.port, this.host, () => {
      console.info(`HTTP server running on port ${this.port}`);
    });
  }
}
