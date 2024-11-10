import Joi from 'joi';
import {chats, users} from '../models/collections.js';
import {createChatSchema, messageSchema} from "../models/chatSchema.js";