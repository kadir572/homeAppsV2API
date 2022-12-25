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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.createNewUser = exports.getAllUsers = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const User_1 = require("../models/User");
const mongoose_1 = __importDefault(require("mongoose"));
const errorMessages_1 = __importDefault(require("../constants/errorMessages"));
// @desc Get all users
// @route GET /user
// @access Private
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield User_1.User.find().select('-password').lean();
    if (!(users === null || users === void 0 ? void 0 : users.length))
        return res.status(400).json({ message: errorMessages_1.default.user.notFound });
    const usersToSend = users.map(user => {
        return {
            id: user._id,
            username: user.username,
            role: user.role,
            active: user.active,
        };
    });
    res.json(usersToSend);
});
exports.getAllUsers = getAllUsers;
// @desc Create new user
// @route POST /user
// @access Private
const createNewUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password, role } = req.body;
    // Confirming data
    if (!username || !password)
        return res.status(400).json({ message: errorMessages_1.default.user.allFieldsReq });
    // Check for duplicate
    const duplicate = yield User_1.User.findOne({ username })
        .collation({ locale: 'en', strength: 2 })
        .lean()
        .exec();
    if (duplicate)
        return res
            .status(409)
            .json({ message: errorMessages_1.default.user.duplicateUsername });
    // Hash password
    const hashedPwd = yield bcrypt_1.default.hash(password, 10);
    const userObject = role !== 'admin' && role !== 'operator'
        ? { username, password: hashedPwd }
        : { username, password: hashedPwd, role };
    // Create and store new user
    const user = yield User_1.User.create(userObject);
    if (user) {
        res.status(201).json({ message: `New user ${username} created` });
        console.log(user);
    }
    else {
        res.status(400).json({ message: errorMessages_1.default.user.invalidUserData });
    }
});
exports.createNewUser = createNewUser;
// @desc Update a user
// @route PATCH /user
// @access Private
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, username, role, active, password } = req.body;
    // Confirm data
    if (!id || !username || !role || typeof active !== 'boolean') {
        return res.status(400).json({ message: errorMessages_1.default.user.allFieldsReq });
    }
    if (!mongoose_1.default.Types.ObjectId.isValid(id))
        return res.status(400).json({ message: errorMessages_1.default.user.notFound });
    const user = yield User_1.User.findById(id).exec();
    if (!user)
        return res.status(400).json({ message: errorMessages_1.default.user.notFound });
    // Check for duplicate
    const duplicate = yield User_1.User.findOne({ username })
        .collation({ locale: 'en', strength: 2 })
        .lean()
        .exec();
    // Allow updates to the original user
    if (duplicate && (duplicate === null || duplicate === void 0 ? void 0 : duplicate._id.toString()) !== id) {
        return res
            .status(409)
            .json({ message: errorMessages_1.default.user.duplicateUsername });
    }
    user.username = username;
    user.role = role;
    user.active = active;
    if (password) {
        user.password = yield bcrypt_1.default.hash(password, 10);
    }
    const updatedUser = yield user.save();
    res.json({ message: `${updatedUser.username} updated successfully` });
});
exports.updateUser = updateUser;
// @desc Delete a user
// @route DELETE /user
// @access Private
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.body;
    if (!id)
        return res.status(400).json({ message: errorMessages_1.default.user.idRequired });
    const user = yield User_1.User.findById(id).exec();
    if (!user)
        return res.status(400).json({ message: errorMessages_1.default.user.notFound });
    const result = yield user.deleteOne();
    res.json({ message: `User ${result.username} with Id ${result.id} deleted` });
});
exports.deleteUser = deleteUser;
//# sourceMappingURL=userController.js.map