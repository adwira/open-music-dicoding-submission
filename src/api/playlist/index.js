const PlaylistsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'playlists',
  version: '1.0.0',
  register: async (server, options) => {
    const {
      playlistService, playlistActivitiesService, songService, validator,
    } = options;
    const playlistsHandler = new PlaylistsHandler(
      playlistService,
      playlistActivitiesService,
      songService,
      validator,
    );
    server.route(routes(playlistsHandler));
  },
};
