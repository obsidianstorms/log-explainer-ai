class Log {
  constructor(logEntryName) {
    this.name = logEntryName;
  }

  log(...args) {
    console.log(`${this.name}`, ...args);
  }
}

export default Log;
