import {users} from '../models/collections.js';
import {
    publicUsersArraySchema,
    publicUserSchema,
    registerUserSchema,
    updateUserSchema,
    userSchema
} from "../models/userSchema.js";

const registerUser = async (req, res) => {
    // Отберём ненужные поля, заполним значениями по умолчанию поля, которые не указаны в запросе.
    let stripValidation = registerUserSchema.validate(req.body, {
        stripUnknown: true, // delete undeclared fields
        abortEarly: false,
        allowUnknown: true
    });

    if (stripValidation.error) {
        return res.status(422).json({error: stripValidation.error.message});
    }

    // Валидация перед добавлением в базу. Проверяем, все ли поля заполнены.
    const checkValidation = userSchema.validate(stripValidation.value, {presence: "required"});

    if (checkValidation.error) {
        return res.status(422).json({error: checkValidation.error.message});
    }

    try {
        let checkedData = stripValidation.value;
        if (req.file) {
            checkedData.avatar = req.file.path;
        }
        const newUser = await users.create(checkedData);
        return res.status(201).json(newUser);
    } catch (error) {
        return res.status(500).json({error: error.message});
    }
};

const updateUser = async (req, res) => {
    let {error, value} = updateUserSchema.validate(req.body, {
        stripUnknown: true, // delete undeclared fields
        abortEarly: false,
        allowUnknown: true
    });
    if (error) {
        return res.status(400).json({error: error.message});
    }

    try {
        if (req.file) {
            value.avatar = req.file.path;
        }
        const result = await users.updateSet({_id: req.params.id}, value);
        if (result.numAffected === 0)
            return res.status(404).json({error: "User not found"});

        const publicResult = publicUserSchema.validate(result.affectedDocuments, {allowUnknown: true});
        if (publicResult.error)
            return res.status(500).json({error: publicResult.error.message});

        return res.status(200).json(publicResult.value);
    } catch (error) {
        return res.status(500).json({error: error.message});
    }
}

const getAllUsers = async (req, res) => {
    try {
        const result = await users.find({}, {}, {}, req.query.skip, req.query.limit);
        const totalCount = await users.count();
        const {error, value} = publicUsersArraySchema.validate(result, {allowUnknown: true});
        if (error)
            return res.status(500).json({error: error.message});

        return res.status(200).json({totalCount, value});
    } catch (error) {
        return res.status(500).json({error: error.message});
    }
}

const getUserById = async (req, res) => {
    try {
        const result = await users.findById(req.params.id);
        if (!result) {
            return res.status(404).json({error: "User not found"});
        }

        const {error, value} = publicUserSchema.validate(result, {allowUnknown: true});
        if (error)
            return res.status(500).json({error: error.message});

        return res.status(200).json(value);
    } catch (error) {
        return res.status(500).json({error: error.message});
    }
}

const getUserFollowing = async (req, res) => {
    const skip = req.query.skip || 0;
    const limit = req.query.limit || 10;
    try {
        const followingList = await users.findById(req.params.id, {following: 1});
        if (!followingList)
            return res.status(404).json({error: "User not found"});

        const value = await users.find({'_id': {$in: followingList.following}}, {firstName: 1, lastName: 1, avatar: 1}, {}, skip, limit);
        const totalCount = await users.count({'_id': {$in: followingList.following}});
        return res.status(200).json({totalCount, value});
    } catch (error) {
        return res.status(500).json({error: error.message});
    }
}

const getUserFollowers = async (req, res) => {
    const skip = req.query.skip || 0;
    const limit = req.query.limit || 10;
    try {
        const followersList = await users.findById(req.params.id, {followers: 1});
        if (!followersList)
            return res.status(404).json({error: "User not found"});

        const value = await users.find({'_id': {$in: followersList.followers}}, {firstName: 1, lastName: 1, avatar: 1}, {}, skip, limit);
        const totalCount = await users.count({'_id': {$in: followersList.followers}});
        return res.status(200).json({totalCount, value});
    } catch (error) {
        return res.status(500).json({error: error.message});
    }
}

const getUsersByQuery = async (req, res) => {
    try {
        const result = await users.find(req.body.query, {}, {}, req.body.skip, req.body.limit);
        const totalCount = await users.count(req.body.query);
        const {error, value} = publicUsersArraySchema.validate(result, {allowUnknown: true});
        if (error)
            return res.status(500).json({error: error.message});

        return res.status(200).json({totalCount, value});
    } catch (error) {
        return res.status(500).json({error: error.message});
    }
}

const deleteUser = async (req, res) => {
    try {
        const result = await users.delete({_id: req.params.id});
        return res.status(result.success ? 200 : 400).json(result);
    } catch (error) {
        return res.status(500).json({error: error.message});
    }
}

export {registerUser, getAllUsers, getUserById, getUserFollowing, getUserFollowers, getUsersByQuery, updateUser, deleteUser};