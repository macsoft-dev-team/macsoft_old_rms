const config = require('../config');

// Logger configuration
let level = config.logging.level || 'info';
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3
};

function shouldLog(logLevel) {
  return levels[logLevel] <= levels[level];
}

function formatMessage(logLevel, message, ...args) {
  const timestamp = new Date().toISOString();
  const formattedMessage = typeof message === 'string' ? message : JSON.stringify(message);
  const extraArgs = args.length > 0 ? ' ' + args.map(arg => 
    typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
  ).join(' ') : '';
  
  return `[${timestamp}] [${logLevel.toUpperCase()}] ${formattedMessage}${extraArgs}`;
}

function error(message, ...args) {
  if (shouldLog('error')) {
    console.error(formatMessage('error', message, ...args));
  }
}

function warn(message, ...args) {
  if (shouldLog('warn')) {
    console.warn(formatMessage('warn', message, ...args));
  }
}

function info(message, ...args) {
  if (shouldLog('info')) {
    console.log(formatMessage('info', message, ...args));
  }
}

function debug(message, ...args) {
  if (shouldLog('debug')) {
    console.log(formatMessage('debug', message, ...args));
  }
}

function setLevel(newLevel) {
  if (levels.hasOwnProperty(newLevel)) {
    level = newLevel;
    info(`Log level set to ${newLevel}`);
  } else {
    warn(`Invalid log level: ${newLevel}. Available levels: ${Object.keys(levels).join(', ')}`);
  }
}

module.exports = {
  error,
  warn,
  info,
  debug,
  setLevel
};