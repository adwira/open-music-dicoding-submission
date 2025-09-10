const AlbumsHandler = require('./AlbumHandler');
const SongHandler = require('./SongHandler');
const routes = require('./routes');

module.exports = {
  name: 'musics',
  version: '1.0.0',
  register: async (server, { service, validator }) => {
    const albumsHandler = new AlbumsHandler(service, validator);
    const songsHandler = new SongHandler(service, validator);
    server.route(routes(albumsHandler, songsHandler));
  },
};
