const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const { mapPlaylistToModel, mapSongInPlaylistToModel } = require('../../utils');
const AuthorizationError = require('../../exceptions/AuthorizationError');

class PlaylistService {
  constructor(collaborationService) {
    this.pool = new Pool();
    this.collaborationService = collaborationService;
  }

  async verifyPlaylistOwner(playlistId, userId) {
    const query = {
      text: 'SELECT * FROM playlists WHERE id = $1',
      values: [playlistId],
    };
    const result = await this.pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Resource yang Anda minta tidak ditemukan');
    }
    const playlist = result.rows[0];
    if (playlist.owner !== userId) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
    }
  }

  async verifyPlaylistAccess(playlistId, userId) {
    try {
      await this.verifyPlaylistOwner(playlistId, userId);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      try {
        await this.collaborationService.verifyCollaborator(playlistId, userId);
      } catch {
        throw error;
      }
    }
  }

  async addPlaylist({ name, userId }) {
    const id = `playlist-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO playlists VALUES($1, $2, $3) RETURNING id',
      values: [id, name, userId],
    };
    const result = await this.pool.query(query);
    if (!result.rows[0].id) {
      throw new InvariantError('Playlist gagal ditambahkan');
    }
    return result.rows[0].id;
  }

  async getPlaylists({ userId }) {
    const query = {
      text: `SELECT DISTINCT p.id, p.name, u.username
             FROM playlists p
             LEFT JOIN collaborations c ON c.playlist_id = p.id
             LEFT JOIN users u ON p.owner = u.id
             WHERE p.owner = $1 OR c.user_id = $1`,
      values: [userId],
    };
    const result = await this.pool.query(query);
    return result.rows.map(mapPlaylistToModel);
  }

  async getSongsInPlaylist(playlistId) {
    const query = {
      text: `SELECT s.id, s.title, s.performer
             FROM songs_in_playlist sip
             LEFT JOIN songs s ON sip.song_id = s.id
             WHERE sip.playlist_id = $1`,
      values: [playlistId],
    };
    const result = await this.pool.query(query);
    return result.rows.map(mapSongInPlaylistToModel);
  }

  async getPlaylistById(playlistId, userId) {
    const query = {
      text: `SELECT DISTINCT p.id, p.name, u.username
             FROM playlists p
             LEFT JOIN collaborations c ON c.playlist_id = p.id
             LEFT JOIN users u ON p.owner = u.id
             WHERE p.id = $1 AND (p.owner = $2 OR c.user_id = $2)`,
      values: [playlistId, userId],
    };
    const result = await this.pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }
    return mapPlaylistToModel(result.rows[0]);
  }

  async deletePlaylistById(playlistId) {
    const query = {
      text: 'DELETE FROM playlists WHERE id = $1 RETURNING id',
      values: [playlistId],
    };
    const result = await this.pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Playlist gagal dihapus. Id tidak ditemukan');
    }
  }
}

module.exports = PlaylistService;
