// src/services/postgres/index.js
const AlbumService = require('./AlbumService');
const SongService = require('./SongService');

class MusicService {
  constructor() {
    this.albumService = new AlbumService();
    this.songService = new SongService();
  }

  async addAlbum(payload) {
    return this.albumService.addAlbum(payload);
  }

  async getAlbumById(id) {
    return this.albumService.getAlbumById(id);
  }

  async editAlbumById(id, payload) {
    return this.albumService.editAlbumById(id, payload);
  }

  async deleteAlbumById(id) {
    return this.albumService.deleteAlbumById(id);
  }

  async addSong(payload) {
    return this.songService.addSong(payload);
  }

  async getSong() {
    return this.songService.getSong();
  }

  async getSongById(id) {
    return this.songService.getSongById(id);
  }

  async editSongById(id, payload) {
    return this.songService.editSongById(id, payload);
  }

  async deleteSongById(id) {
    return this.songService.deleteSongById(id);
  }

  async getSongInAlbum(id) {
    return this.songService.getSongInAlbum(id);
  }

  async getSongByTitle(title) {
    return this.songService.getSongByTitle(title);
  }

  async getSongByPerformer(performer) {
    return this.songService.getSongByPerformer(performer);
  }

  async getSongByTitleAndPerformer(title, performer) {
    return this.songService.getSongByTitleAndPerformer(title, performer);
  }
}

module.exports = {
  MusicService,
};
