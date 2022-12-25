"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
// CONFIGURATION
const router = express_1.default.Router();
router.all('*', (req, res) => {
    res.sendFile(path_1.default.join(__dirname, '..', 'views', '404.html'));
});
exports.default = router;
//# sourceMappingURL=errorRoute.js.map