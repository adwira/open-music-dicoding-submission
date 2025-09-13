const ClientError = require('../../exceptions/ClientError');

class PlaylistsHandler {
  constructor(playlistService, playlistActivitiesService, songService, validator) {
    this.playlistService = playlistService;
    this.songService = songService;
    this.playlistActivitiesService = playlistActivitiesService;
    this.validator = validator;

    this.postPlaylistHandler = this.postPlaylistHandler.bind(this);
    this.getPlaylistHandler = this.getPlaylistHandler.bind(this);
    this.getSongFromPlaylistHandler = this.getSongFromPlaylistHandler.bind(this);
    this.postSongToPlaylistHandler = this.postSongToPlaylistHandler.bind(this);
    this.deletePlaylistHandler = this.deletePlaylistHandler.bind(this);
    this.deleteSongFromPlaylistHandler = this.deleteSongFromPlaylistHandler.bind(this);
    this.getPlaylistActivitiesHandler = this.getPlaylistActivitiesHandler.bind(this);
  }

  async postPlaylistHandler(request, h) {
    try {
      this.validator.validatePlaylistPayload(request.payload);
      const { name } = request.payload;
      const { id: credentialId } = request.auth.credentials;
      const playlistId = await this.playlistService.addPlaylist({ name, userId: credentialId });

      const response = h.response({
        status: 'success',
        data: {
          playlistId,
        },
      });
      response.code(201);
      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }

  async getPlaylistHandler(request) {
    const { id: credentialId } = request.auth.credentials;
    const playlists = await this.playlistService.getPlaylists({ userId: credentialId });
    return {
      status: 'success',
      data: {
        playlists,
      },
    };
  }

  async getSongFromPlaylistHandler(request, h) {
    try {
      const { id: credentialId } = request.auth.credentials;
      const { id } = request.params;
      await this.playlistService.verifyPlaylistAccess(id, credentialId);
      const playlist = await this.playlistService.getPlaylistById(id, credentialId);
      const songs = await this.playlistService.getSongsInPlaylist(id);
      const songsArray = Array.isArray(songs) ? songs : [];
      return {
        status: 'success',
        data: {
          playlist: {
            id,
            name: playlist.name,
            username: playlist.username,
            songs: songsArray.map((song) => ({
              id: song.id,
              title: song.title,
              performer: song.performer,
            })),
          },
        },
      };
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }

  async postSongToPlaylistHandler(request, h) {
    try {
      await this.validator.validatePlaylistSongPayload(request.payload);
      const { id } = request.params;
      const { id: credentialId } = request.auth.credentials;
      const { songId } = request.payload;
      await this.playlistService.verifyPlaylistAccess(id, credentialId);
      await this.songService.getSongById(songId);
      await this.playlistActivitiesService.addSongToPlaylist(credentialId, id, songId);
      const response = h.response({
        status: 'success',
        message: 'Lagu berhasil ditambahkan ke playlist',
      });
      response.code(201);
      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }

  async deleteSongFromPlaylistHandler(request, h) {
    try {
      await this.validator.validatePlaylistSongPayload(request.payload);
      const { id } = request.params;
      const { id: credentialId } = request.auth.credentials;
      const { songId } = request.payload;
      await this.playlistService.verifyPlaylistAccess(id, credentialId);
      await this.playlistActivitiesService.deleteSongFromPlaylist(credentialId, id, songId);
      const response = h.response({
        status: 'success',
        message: 'Lagu berhasil dihapus dari playlist',
      });
      response.code(200);
      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }

  async deletePlaylistHandler(request, h) {
    try {
      const { id: credentialId } = request.auth.credentials;
      const { id } = request.params;
      await this.playlistService.verifyPlaylistOwner(id, credentialId);
      await this.playlistService.deletePlaylistById(id);
      return {
        status: 'success',
        message: 'Playlist berhasil dihapus',
      };
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }

  async getPlaylistActivitiesHandler(request, h) {
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;
    await this.playlistService.verifyPlaylistAccess(id, credentialId);
    const activities = await this.playlistActivitiesService.getPlaylistActivitiesById(id);
    const response = h.response({
      status: 'success',
      data: {
        playlistId: id,
        activities,
      },
    });
    response.code(200);
    return response;
  }
}

module.exports = PlaylistsHandler;
