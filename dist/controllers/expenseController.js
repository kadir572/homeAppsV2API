"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteExpense = exports.updateExpense = exports.createNewExpense = exports.getAllExpenses = void 0;
const Expense_1 = require("../models/Expense");
const User_1 = require("../models/User");
const errorMessages_1 = __importDefault(require("../constants/errorMessages"));
// @desc Get all expenses
// @route GET /expense
// @access Private
const getAllExpenses = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const expenses = yield Expense_1.Expense.find().lean();
    if (!expenses.length)
        return res.status(400).json({ message: errorMessages_1.default.expense.notFound });
    const mappedExpenses = expenses.map(expense => {
        const { _id, debtors } = expense, rest = __rest(expense, ["_id", "debtors"]);
        const mappedDebtors = debtors.map(debtor => {
            const { _id: debtorId } = debtor, debtorRest = __rest(debtor, ["_id"]);
            return Object.assign({}, debtorRest);
        });
        return Object.assign({ id: _id, debtors: mappedDebtors }, rest);
    });
    res.json(mappedExpenses);
});
exports.getAllExpenses = getAllExpenses;
// @desc Create new expense
// @route POST /expense
// @access Private
const createNewExpense = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, description, cost, payor, debtors } = req.body;
    if (!title || !description || !cost || !payor || !debtors || !(debtors === null || debtors === void 0 ? void 0 : debtors.length))
        return res.status(400).json({ message: 'All fields are required' });
    const payorObj = yield User_1.User.findById(payor);
    if (!payorObj)
        return res.status(400).json({ message: 'Payor does not exist' });
    debtors.forEach((debtor) => {
        const debtorObj = User_1.User.findById(debtor._id);
        if (!debtorObj)
            return res.status(400).json({ message: 'Debtor does not exist' });
    });
    const expense = yield Expense_1.Expense.create({
        title,
        description,
        cost,
        payor,
        debtors,
    });
    if (expense) {
        res.status(201).json({ message: 'Expense created' });
    }
    else {
        res.status(400).json({ message: 'Invalid expense data' });
    }
});
exports.createNewExpense = createNewExpense;
// @desc Update an expense
// @route PATCH /expense
// @access Private
const updateExpense = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, title, description, cost, payor, debtors } = req.body;
    if (!title || !description || !cost || !payor || !debtors)
        return res.status(400).json({ message: 'All fields are required' });
    const expense = yield Expense_1.Expense.findById(id);
    if (!expense)
        return res.status(400).json({ message: 'Expense does not exist' });
    expense.title = title;
    expense.description = description;
    expense.cost = cost;
    expense.payor = payor;
    expense.debtors = debtors;
    yield expense.save();
    res.json({ message: 'Expense updated successfully' });
});
exports.updateExpense = updateExpense;
// @desc Delete an expense
// @route DELETE /expense
// @access Private
const deleteExpense = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.body;
    const expense = yield Expense_1.Expense.findById(id).exec();
    if (!expense)
        return res.status(400).json({ message: 'Expense does not exist' });
    if (expense.debtors.some(debtor => !debtor.paid)) {
        return res.status(400).json({ message: 'Expense has not been fully paid' });
    }
    yield expense.delete();
    res.status(400).json({ message: 'Expense has been successfully deleted' });
});
exports.deleteExpense = deleteExpense;
//# sourceMappingURL=expenseController.js.map