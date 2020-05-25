// errors/permission-err.js

class PermissionError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 403;
  }
}

module.exports = PermissionError;