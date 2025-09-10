const ClientError = require('./ClientError');

class NotFoundError extends ClientError {
  constructor(message) {
    super(message, 404);
    /* eslint-disable no-underscore-dangle */
    this._name = 'NotFoundError';
    /* eslint-enable no-underscore-dangle */
  }
}

module.exports = NotFoundError;
