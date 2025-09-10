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

const mapAlbumToModel = ({
  id,
  name,
  year,
}) => ({
  id,
  name,
  year,
});

module.exports = { mapAlbumToModel, mapSongToModel };
