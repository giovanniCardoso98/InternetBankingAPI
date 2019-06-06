var winston = require('winston');

module.exports = winston.createLogger({
	transports:[
        new winston.transports.File({
            name: 'infos',
            level: "info",
            filename: "./logs/infos",
            maxsize: 1048576,
            maxFiles: 5,
            colorize: false
        }),
        new winston.transports.File({
            name: 'errors',
            level: "error",
            filename: "./logs/errors",
            maxsize: 1048576,
            maxFiles: 5,
            colorize: false
        })
	]
});