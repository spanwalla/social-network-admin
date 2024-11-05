import {users, posts} from '../models/collections.js';
import {createPostSchema, postSchema} from "../models/postSchema.js";

const createPost = async (req, res) => {
    // Отберём ненужные поля, заполним значениями по умолчанию поля, которые не указаны в запросе.
    let stripValidation = createPostSchema.validate(req.body, {
        stripUnknown: true, // delete undeclared fields
        abortEarly: false,
        allowUnknown: true
    });

    if (stripValidation.error) {
        return res.status(422).json({error: stripValidation.error.message});
    }

    // Валидация перед добавлением в базу. Проверяем, все ли поля заполнены.
    const checkValidation = postSchema.validate(stripValidation.value, {presence: "required"});

    if (checkValidation.error) {
        return res.status(422).json({error: checkValidation.error.message});
    }

    try {
        let checkedData = stripValidation.value;
        const newPost = await posts.create(checkedData);
        await users.update({_id: checkedData.authorId}, {$addToSet: {posts: newPost._id}});
        return res.status(201).json(newPost);
    } catch (error) {
        return res.status(500).json({error: error.message});
    }
}

const getAllPosts = async (req, res) => {
    const skip = req.query.skip || 0;
    const limit = req.query.limit || 20;
    try {
        const result = await posts.find({}, {}, {createdAt: -1}, skip, limit);
        const totalCount = await posts.count();
        const authorIds = new Set(result.map(r => r.authorId));
        const authors = await users.find({_id: {$in: Array.from(authorIds)}}, {firstName: 1, lastName: 1, avatar: 1});
        return res.status(200).json({totalCount, posts: result, authors});
    } catch (error) {
        return res.status(500).json({error: error.message});
    }
}

const getPostById = async (req, res) => {
    try {
        const result = await posts.findById(req.params.id);
        const author = await users.findById(result.authorId, {firstName: 1, lastName: 1, avatar: 1});
        return res.status(200).json({post: result, author});
    } catch (error) {
        return res.status(500).json({error: error.message});
    }
}

const getPostsByQuery = async (req, res) => {
    try {
        const result = await posts.find(req.body.query, {}, {}, req.body.skip, req.body.limit);
        const totalCount = await posts.count(req.body.query);
        const authorIds = new Set(result.map(r => r.authorId));
        const authors = await users.find({_id: {$in: Array.from(authorIds)}}, {firstName: 1, lastName: 1, avatar: 1});
        return res.status(200).json({totalCount, posts: result, authors});
    } catch (error) {
        return res.status(500).json({error: error.message});
    }
}

const getUserFeed = async (req, res) => {
    const skip = req.query.skip || 0;
    const limit = req.query.limit || 15;
    try {
        const user = await users.findById(req.params.id, {following: 1});
        const result = await posts.find({authorId: {$in: user.following}}, {}, {createdAt: -1}, skip, limit);
        const totalCount = await posts.count({authorId: {$in: user.following}});
        const authorIds = new Set(result.map(r => r.authorId));
        const authors = await users.find({_id: {$in: Array.from(authorIds)}}, {firstName: 1, lastName: 1, avatar: 1});
        return res.status(200).json({totalCount, posts: result, authors});
    } catch (error) {
        return res.status(500).json({error: error.message});
    }
}

export {createPost, getAllPosts, getPostById, getPostsByQuery, getUserFeed};