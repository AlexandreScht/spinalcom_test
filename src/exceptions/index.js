export class ClientException extends Error {
  constructor(status = 500, message = "An error occurred") {
    super(Array.isArray(message) ? message.join(' | ') : message);
    this.status = status;
    this.message = Array.isArray(message) ? message.join(' | ') : message;
  }
}

export class NotFoundError extends ClientException {
  constructor(message = 'Resource not found') {
    super(404, message);
  }
}

export class InvalidArgumentError extends ClientException {
  constructor(message = 'invalid props') {
    super(422, message);
  }
}
