import express from 'express';
import path from 'path';
import http from 'http';

const port: number = 3000;

class App {
  private server: http.Server;
  private port: number;

  constructor(port: number) {
    this.port = port;
    const app = express();
    app.use(express.static(path.join(__dirname, '../client')));
    app.use(
      '/build/three.module.js',
      express.static(
        path.join(__dirname, '../../node_modules/three/build/three.module.js')
      )
    );
    app.use(
      '/jsm/controls/OrbitControls',
      express.static(
        path.join(
          __dirname,
          '../../node_modules/three/examples/jsm/controls/OrbitControls.js'
        )
      )
    );
    app.use(
      '/jsm/loaders/GLTFLoader',
      express.static(
        path.join(
          __dirname,
          '../../node_modules/three/examples/jsm/loaders/GLTFLoader.js'
        )
      )
    );
    app.use(
      '/jsm/loaders/DRACOLoader',
      express.static(
        path.join(
          __dirname,
          '../../node_modules/three/examples/jsm/loaders/DRACOLoader.js'
        )
      )
    );
    app.use(
      '/js/libs/draco/',
      express.static(
        path.join(__dirname, '../../node_modules/three/examples/js/libs/draco/')
      )
    );
    app.use(
      '/jsm/libs/stats.module',
      express.static(
        path.join(
          __dirname,
          '../../node_modules/three/examples/jsm/libs/stats.module.js'
        )
      )
    );
    this.server = new http.Server(app);
  }

  public Start() {
    this.server.listen(this.port, () => {
      console.log(`Server listening on port ${this.port}.`);
    });
  }
}

new App(port).Start();
