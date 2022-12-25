"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("express-async-errors");
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const rootRoute_1 = __importDefault(require("./routes/rootRoute"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const expenseRoutes_1 = __importDefault(require("./routes/expenseRoutes"));
const shoppingRoutes_1 = __importDefault(require("./routes/shoppingRoutes"));
const errorRoute_1 = __importDefault(require("./routes/errorRoute"));
const corsOptions_1 = __importDefault(require("./config/corsOptions"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const dbConn_1 = __importDefault(require("./config/dbConn"));
const mongoose_1 = __importDefault(require("mongoose"));
const errorHandler_1 = __importDefault(require("./middleware/errorHandler"));
const logger_1 = require("./middleware/logger");
// CONFIGURATION
dotenv_1.default.config();
const app = (0, express_1.default)();
mongoose_1.default.set('strictQuery', true);
(0, dbConn_1.default)();
const PORT = process.env.PORT || process.env.SERVER_PORT;
app.use('/', express_1.default.static(path_1.default.join(__dirname, 'public')));
app.use(logger_1.logger);
app.use((0, cors_1.default)(corsOptions_1.default));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
// ROUTES
app.use('/', rootRoute_1.default);
app.use('/user', userRoutes_1.default);
app.use('/expense', expenseRoutes_1.default);
app.use('/shopping', shoppingRoutes_1.default);
app.all('*', errorRoute_1.default);
app.use(errorHandler_1.default);
mongoose_1.default.connection.once('open', () => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
mongoose_1.default.connection.on('error', err => {
    console.log(err);
});
//# sourceMappingURL=server.js.map