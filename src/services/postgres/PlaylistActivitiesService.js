const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');

class PlaylistActivitiesService {
  constructor() {
    this.pool = new Pool();
  }

  async addActivities(userId, playlistId, songId, action) {
    const id = `activities-${nanoid(16)}`;
    const query = {
      text: `INSERT INTO activities (id, playlist_id, song_id, user_id, action) 
            VALUES($1, $2, $3, $4, $5) RETURNING id`,
      values: [id, playlistId, songId, userId, action],
    };
    const result = await this.pool.query(query);
    if (!result.rows.length) {
      throw new InvariantError('Activites gagal di tambahkan');
    }
  }

  async addSongToPlaylist(userId, playlistId, songId) {
    const action = 'add';
    const id = `sip-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO songs_in_playlist VALUES($1, $2, $3) RETURNING id',
      values: [id, playlistId, songId],
    };
    const result = await this.pool.query(query);
    if (!result.rows.length) {
      throw new InvariantError('Lagu gagal ditambahkan ke playlist');
    }
    await this.addActivities(userId, playlistId, songId, action);
  }

  async getPlaylistActivitiesById(playlistId) {
    const query = {
      text: `SELECT u.username, s.title, a.action, a.time
             FROM activities a
             LEFT JOIN users u ON a.user_id = u.id
             LEFT JOIN songs s ON a.song_id = s.id
             WHERE a.playlist_id = $1
             ORDER BY a.time ASC`,
      values: [playlistId],
    };
    const result = await this.pool.query(query);
    return result.rows;
  }

  async deleteSongFromPlaylist(userId, playlistId, songId) {
    const action = 'delete';
    const query = {
      text: 'DELETE FROM songs_in_playlist WHERE playlist_id = $1 AND song_id = $2 RETURNING id',
      values: [playlistId, songId],
    };
    const result = await this.pool.query(query);
    if (!result.rows.length) {
      throw new InvariantError('Lagu gagal dihapus dari playlist');
    }
    await this.addActivities(userId, playlistId, songId, action);
  }
}

module.exports = PlaylistActivitiesService;
