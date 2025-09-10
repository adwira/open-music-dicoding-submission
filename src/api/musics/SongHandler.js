class SongHandler {
  constructor(service, validator) {
    this.service = service;
    this.validator = validator;

    this.getSongByIdHandler = this.getSongByIdHandler.bind(this);
    this.putSongByIdHandler = this.putSongByIdHandler.bind(this);
    this.getSongsHandler = this.getSongsHandler.bind(this);
    this.postSongHandler = this.postSongHandler.bind(this);
    this.deleteSongByIdHandler = this.deleteSongByIdHandler.bind(this);
  }

  async postSongHandler(request, h) {
    this.validator.validateSongPayload(request.payload);
    const {
      title, year, genre, performer, duration, albumId,
    } = request.payload;
    const id = await this.service.addSong({
      title, year, genre, performer, duration, albumId,
    });
    const response = h.response({
      status: 'success',
      message: 'Song berhasil ditambahkan',
      data: {
        songId: id,
      },
    });
    response.code(201);
    return response;
  }

  async getSongsHandler(request, h) {
    this.validator.validateQuery(request.query);
    const { title, performer } = request.query;
    if (title && !performer) {
      const songs = await this.service.getSongByTitle(title);
      const response = h.response({
        status: 'success',
        data: {
          songs,
        },
      });
      response.code(200);
      return response;
    }

    if (!title && performer) {
      const songs = await this.service.getSongByPerformer(performer);
      const response = h.response({
        status: 'success',
        data: {
          songs,
        },
      });
      response.code(200);
      return response;
    }
    if (title && performer) {
      const songs = await this.service.getSongByTitleAndPerformer(title, performer);
      const response = h.response({
        status: 'success',
        data: {
          songs,
        },
      });
      response.code(200);
      return response;
    }
    const songs = await this.service.getSong();
    const response = h.response({
      status: 'success',
      data: {
        songs,
      },
    });
    response.code(200);
    return response;
  }

  async getSongByIdHandler(request, h) {
    const { id } = request.params;
    const song = await this.service.getSongById(id);
    const response = h.response({
      status: 'success',
      data: { song },
    });
    response.code(200);
    return response;
  }

  async putSongByIdHandler(request, h) {
    this.validator.validateSongPayload(request.payload);
    const { id } = request.params;
    await this.service.editSongById(id, request.payload);
    const response = h.response({
      status: 'success',
      message: 'Song berhasil diperbarui',
    });
    response.code(200);
    return response;
  }

  async deleteSongByIdHandler(request, h) {
    const { id } = request.params;
    await this.service.deleteSongById(id);
    const response = h.response({
      status: 'success',
      message: 'Song berhasil dihapus',
    });
    response.code(200);
    return response;
  }
}

module.exports = SongHandler;
