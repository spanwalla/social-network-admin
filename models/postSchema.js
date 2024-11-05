import Joi from 'joi';

export const commentSchema = Joi.object({
    authorId: Joi.string(),
    comment: Joi.string().max(256),
    createdAt: Joi.date().alter({
        create: (schema) => schema.default(Date.now),
        update: (schema) => schema.forbidden()
    }),
    updatedAt: Joi.date().default(Date.now)
});

export const reactionSchema = Joi.object({
    userId: Joi.string(),
    reactionType: Joi.string().allow('like', 'dislike'),
});

export const mediaSchema = Joi.object({
    authorId: Joi.string(),
    mediaType: Joi.string().allow('image'),
    path: Joi.string().dataUri()
});

export const postSchema = Joi.object({
    authorId: Joi.string(),
    content: Joi.string().max(1024),
    media: Joi.array().items(mediaSchema).max(3).alter({
        create: (schema) => schema.default([])
    }),
    reactions: Joi.array().items(reactionSchema).alter({
        create: (schema) => schema.default([])
    }),
    comments: Joi.array().items(commentSchema).alter({
        create: (schema) => schema.default([])
    }),
    createdAt: Joi.date().alter({
        create: (schema) => schema.default(Date.now),
        update: (schema) => schema.forbidden()
    }),
    updatedAt: Joi.date().default(Date.now)
});

export const createCommentSchema = commentSchema.tailor('create');
export const updateCommentSchema = commentSchema.tailor('update');
export const createPostSchema = postSchema.tailor('create').or('content', 'media');
export const updatePostSchema = postSchema.tailor('update');