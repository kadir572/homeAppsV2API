"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const expenseController_1 = require("./../controllers/expenseController");
const express_1 = __importDefault(require("express"));
// import {} from '../controllers/expenseController'
// CONFIGURATION
const router = express_1.default.Router();
router
    .route('/')
    .get(expenseController_1.getAllExpenses)
    .post(expenseController_1.createNewExpense)
    .patch(expenseController_1.updateExpense)
    .delete(expenseController_1.deleteExpense);
exports.default = router;
//# sourceMappingURL=expenseRoutes.js.map