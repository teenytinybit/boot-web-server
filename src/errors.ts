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

export { NotFoundError, ChirpValidationError };
