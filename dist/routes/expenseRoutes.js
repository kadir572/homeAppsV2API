"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// import {} from '../controllers/expenseController'
// CONFIGURATION
const router = express_1.default.Router();
router.route('/').get().post().patch().delete();
exports.default = router;
//# sourceMappingURL=expenseRoutes.js.map