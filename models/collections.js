import Datastore from "@seald-io/nedb";
import path from "path";
import dotenv from "dotenv";
import {Database} from "./Database.js";

dotenv.config();
const dbDir = process.env.DB_DIR || 'db';

const usersCollection = new Datastore({
    filename: path.join(dbDir, process.env.USERS_DB || 'users.json'),
    autoload: true
});

const postsCollection = new Datastore({
    filename: path.join(dbDir, process.env.POSTS_DB || 'posts.json'),
    autoload: true,
});

const chatsCollection = new Datastore({
    filename: path.join(dbDir, process.env.CHATS_DB || 'chats.json'),
    autoload: true,
});

// Создание экземпляров класса Database для каждой коллекции
const users = new Database(usersCollection);
const posts = new Database(postsCollection);
const chats = new Database(chatsCollection);

export {users, posts, chats};