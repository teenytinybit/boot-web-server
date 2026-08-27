class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
  }
}

class ValidationError extends Error {
  constructor(message: string) {
    super(message);
  }
}

class InvalidJWTError extends Error {
  constructor() {
    super("Invalid token");
  }
}

class ApiKeyError extends Error {
  constructor() {
    super("Invalid API key");
  }
}

export { NotFoundError, ValidationError, InvalidJWTError, ApiKeyError };
