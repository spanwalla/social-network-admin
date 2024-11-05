import {users} from '../models/collections.js';
import Joi from 'joi';
import {publicUserSchema} from "../models/userSchema.js";

const followUser = async (req, res) => {
    const followSchema = Joi.object({
        // TODO: При авторизации ID пользователя нужно получать из JWT-токена.
        id: Joi.string().max(32).required().note('ID отправителя запроса.'),
        followingId: Joi.string().max(32).required().note('ID отслеживаемого пользователя.')
    });

    const {error, value} = followSchema.validate(req.body, {stripUnknown: true, abortEarly: false});
    if (error) {
        return res.status(400).json({error: error.message});
    }

    const followerUser = await users.findById(value.id);
    const followingUser = await users.findById(value.followingId);

    if (!followerUser || !followingUser) {
        return res.status(400).json({error: "User not found."});
    }

    // TODO: Транзакции, операция должна быть атомарной, но в NeDB такого функционала нет.
    const followerResult = await users.update({_id: followerUser._id}, {$addToSet: {following: followingUser._id}});
    const followingResult = await users.update({_id: followingUser._id}, {$addToSet: {followers: followerUser._id}});

    if (followerResult.numAffected === 0 || followingResult.numAffected === 0) {
        return res.status(500).json({error: "Error in updating query."});
    }

    const hiddenResult = publicUserSchema.validate(followerResult.affectedDocuments, {allowUnknown: true});
    if (hiddenResult.error)
        return res.status(500).json({error: hiddenResult.error.message});

    return res.status(200).json(hiddenResult.value);
}

export {followUser};