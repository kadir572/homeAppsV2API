"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("./logger");
const errorHandler = (err, req, res, next) => {
    (0, logger_1.logEvents)(`${err.name}: ${err.message}\t${req.method}\t${req.url}\t${req.headers.origin}`, 'errLog.log');
    console.log(err.stack);
    const status = res.statusCode ? res.statusCode : 500;
    res.status(status);
    res.json({ message: err.message, isError: true }); // isError is used for RTK Query, because all errors give a 200 and isError is the defining factor whether the response is an error
};
exports.default = errorHandler;
//# sourceMappingURL=errorHandler.js.map