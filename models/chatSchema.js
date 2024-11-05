import Joi from 'joi';

export const messageSchema = Joi.object({
    senderId: Joi.string(),
    content: Joi.string().max(512).trim(),
    createdAt: Joi.date().default(Date.now).forbidden()
});

export const chatSchema = Joi.object({
    participants: Joi.array().items(Joi.string()).min(2).max(50),
    messages: Joi.array().items(messageSchema).alter({
        create: (schema) => schema.default([])
    }),
    createdAt: Joi.date().alter({
        create: (schema) => schema.default(Date.now),
        update: (schema) => schema.forbidden()
    })
});

export const createChatSchema = chatSchema.tailor('create');
export const updateChatSchema = chatSchema.tailor('update');