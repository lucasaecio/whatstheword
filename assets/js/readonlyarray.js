export default class ReadOnlyArray extends Array {
  constructor(mutable) {
    return Object.seal(mutable.slice());
  }
}
