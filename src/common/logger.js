export function logDebug(msg, ...args) {
  console.debug(prefix() + msg, ...args);
}

export function logInfo(msg, ...args) {
  console.info(prefix() + msg, ...args);
}

export function logWarn(msg, ...args) {
  console.warn(prefix() + msg, ...args);
}

export function logError(msg, ...args) {
  console.error(prefix() + msg, ...args);
}

/**
 * @returns {string}
 */
function prefix() {
  const now = new Date();
  const timeStr =
    now.toTimeString().substring(0, 8) +
    "." +
    now.getMilliseconds().toString().padStart(3, "0");

  return `[Log] ${timeStr} `;
}
