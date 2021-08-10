export class NonPublicVideoError extends Error {
  constructor(msg: string) {
    super(msg);

    // set the prototype explicity
    Object.setPrototypeOf(this, NonPublicVideoError.prototype);
  }
}
