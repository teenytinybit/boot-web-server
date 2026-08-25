class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
  }
}

class ChirpValidationError extends Error {
  constructor() {
    super("Chirp is too long. Max length is 140");
  }
}

class InvalidJWTError extends Error {
  constructor() {
    super("Invalid token");
  }
}

export { NotFoundError, ChirpValidationError, InvalidJWTError };
