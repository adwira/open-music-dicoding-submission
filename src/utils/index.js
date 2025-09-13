/* eslint-disable camelcase */
const mapSongToModel = ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  album_id,
}) => ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  albumId: album_id,
});
const mapSongInPlaylistToModel = ({
  id,
  title,
  performer,
}) => ({
  id,
  title,
  performer,
});

const mapAlbumToModel = ({
  id,
  name,
  year,
}) => ({
  id,
  name,
  year,
});

const mapPlaylistToModel = ({
  id,
  name,
  username,
}) => ({
  id,
  name,
  username,
});

module.exports = {
  mapAlbumToModel, mapSongToModel, mapPlaylistToModel, mapSongInPlaylistToModel,
};
