const Joi = require('joi');

const SongPayloadSchema = Joi.object({
  title: Joi.string().required(),
  year: Joi.number()
    .integer()
    .min(1000)
    .max(9999)
    .required(),
  performer: Joi.string().required(),
  genre: Joi.string().required(),
  duration: Joi.number().integer().allow(null).optional(),
  albumId: Joi.string().allow(null).optional(),
});

const QueryPayloadSchema = Joi.object({
  title: Joi.string().allow(null).optional(),
  performer: Joi.string().allow(null).optional(),
});

const AlbumPayloadSchema = Joi.object({
  name: Joi.string().required(),
  year: Joi.number().integer().required(),
});

module.exports = { SongPayloadSchema, AlbumPayloadSchema, QueryPayloadSchema };
