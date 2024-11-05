import Joi from 'joi';

const nameSchema = Joi.string().min(2).max(32).messages({
    'string.base': 'Имя и фамилия должны быть строками',
    'string.empty': 'Имя и фамилия не должны быть пустыми',
    'string.min': 'Имя/фамилия должна содержать как минимум 2 символа',
    'string.max': 'Имя/фамилия не должны содержать более 32 символов'
});

const userSchema = Joi.object({
    firstName: nameSchema,
    lastName: nameSchema,
    birthday: Joi.date().less('now'),
    bio: Joi.string().max(140).trim().allow('').alter({
        register: (schema) => schema.default('')
    }),
    avatar: Joi.string().alter({
        register: (schema) => schema.default('no-avatar'),
    }),
    email: Joi.string().email().messages({
        'string.email': 'Адрес электронной почты некорректен'
    }),
    password: Joi.string().min(6).max(64).messages({
        'string.min': 'Пароль должен содержать минимум 6 символов',
        'string.max': 'Пароль должен содержать не более 64 символов'
    }),
    status: Joi.string().valid('active', 'inactive', 'blocked').alter({
        register: (schema) => schema.default('inactive')
    }),
    role: Joi.string().valid('user', 'admin').alter({
        register: (schema) => schema.default('user')
    }),
    following: Joi.array().items(Joi.string()).alter({
        register: (schema) => schema.default([])
    }),
    followers: Joi.array().items(Joi.string()).alter({
        register: (schema) => schema.default([])
    }),
    posts: Joi.array().items(Joi.string()).alter({
        register: (schema) => schema.default([])
    }),
    chats: Joi.array().items(Joi.string()).alter({
        register: (schema) => schema.default([])
    }),
    createdAt: Joi.date().alter({
        register: (schema) => schema.default(Date.now),
        update: (schema) => schema.forbidden()
    }),
    updatedAt: Joi.date().default(Date.now)
}).alter({
    public: schema => schema
        .fork(['password', 'chats'], field => field.strip()) // скрыть эти поля из публичной выдачи
});

const registerUserSchema = userSchema.tailor('register')
const updateUserSchema = userSchema.tailor('update');
const publicUserSchema = userSchema.tailor('public');
const publicUsersArraySchema = Joi.array().items(publicUserSchema);

export {userSchema, registerUserSchema, updateUserSchema, publicUserSchema, publicUsersArraySchema};