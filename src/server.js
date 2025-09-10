require('dotenv').config();
const Hapi = require('@hapi/hapi');
const musics = require('./api/musics');
const { MusicService } = require('./services/postgres');
const ClientError = require('./exceptions/ClientError');
const MusicsValidator = require('./validator/musics');

const init = async () => {
  const musicService = new MusicService();
  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register({
    plugin: musics,
    options: {
      service: musicService,
      validator: MusicsValidator,
    },
  });

  server.ext('onPreResponse', (request, h) => {
    const { response } = request;

    if (response instanceof ClientError) {
      const newResponse = h.response({
        status: 'fail',
        message: response.message,
      });
      newResponse.code(response.statusCode);
      return newResponse;
    }
    return h.continue;
  });

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
