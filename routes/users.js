import express from 'express';
import createHttpError from "http-errors";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

const API_URL = process.env.API_URL || 'http://localhost:3000/api';
const recordsPerPage = 10;

router.get('/all', function (req, res, next) {
    fetch(API_URL + `/user?skip=${((parseInt(req.query.page) || 1) - 1) * recordsPerPage}&limit=${recordsPerPage}`, {
        method: 'GET'
    }).then((response) => response.json())
        .then(({totalCount, value}) => {
            res.render('users', {heading: 'Список пользователей', currentPage: parseInt(req.query.page) || 1, totalPages: Math.max(Math.ceil(totalCount / recordsPerPage), 1), users: value}, (err, html) => {
                if (err)
                    return next(createHttpError(err));

                res.render('layout', {
                    title: 'Все пользователи. Social',
                    customScripts: ['users'],
                    main: html
                });
            });
        })
        .catch((err) => {
            next(createHttpError(err));
        });
});

router.get('/unconfirmed', function (req, res, next) {
    fetch(API_URL + '/user/filter', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            skip: ((parseInt(req.query.page) || 1) - 1) * recordsPerPage,
            limit: recordsPerPage,
            query: {
                status: 'inactive'
            }
        })
    }).then((response) => response.json())
        .then(({totalCount, value}) => {
            res.render('users', {heading: 'Список неподтверждённых пользователей', currentPage: parseInt(req.query.page) || 1, totalPages: Math.max(Math.ceil(totalCount / recordsPerPage), 1), users: value}, (err, html) => {
                if (err)
                    return next(createHttpError(err));

                res.render('layout', {
                    title: 'Неподтверждённые пользователи. Social',
                    customScripts: ['users'],
                    main: html
                });
            });
        })
        .catch((err) => {
            next(createHttpError(err));
        });
});

router.get('/blocked', function (req, res, next) {
    fetch(API_URL + '/user/filter', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            skip: ((parseInt(req.query.page) || 1) - 1) * recordsPerPage,
            limit: recordsPerPage,
            query: {
                status: 'blocked'
            }
        })
    }).then((response) => response.json())
        .then(({totalCount, value}) => {
            res.render('users', {heading: 'Список заблокированных пользователей', currentPage: parseInt(req.query.page) || 1, totalPages: Math.max(Math.ceil(totalCount / recordsPerPage), 1), users: value}, (err, html) => {
                if (err)
                    return next(createHttpError(err));

                res.render('layout', {
                    title: 'Заблокированные пользователи. Social',
                    customScripts: ['users'],
                    main: html
                });
            });
        })
        .catch((err) => {
            next(createHttpError(err));
        });
});

router.get('/add', function (req, res, next) {
    res.render('manage', {type: 'add'}, (err, html) => {
        if (err)
            return next(createHttpError(err));

        res.render('layout', {
            title: `Добавление пользователя. Social`,
            customScripts: ['manage'],
            main: html
        });
    });
});

router.get('/:userId', function (req, res, next) {
    fetch(API_URL + `/user/${req.params.userId}`, {
        method: 'GET'
    }).then((response) => response.json())
        .then((user) => {
            if (user.error)
                return next(createHttpError(user.error));

            res.render('user', {user}, (err, html) => {
                if (err)
                    return next(createHttpError(err));

                res.render('layout', {
                    title: `${user.firstName} ${user.lastName}. Social`,
                    customScripts: ['user'],
                    main: html
                });
            });
        })
        .catch((err) => {
            next(createHttpError(err));
        });
});

router.get('/:userId/edit', function (req, res, next) {
    fetch(API_URL + `/user/${req.params.userId}`, {
        method: 'GET'
    }).then((response) => response.json())
        .then((user) => {
            if (user.error)
                return next(createHttpError(user.error));
            res.render('manage', {type: 'edit', user}, (err, html) => {
                if (err)
                    return next(createHttpError(err));

                res.render('layout', {
                    title: `Редактирование пользователя. Social`,
                    customScripts: ['manage'],
                    main: html
                });
            });
        })
        .catch((err) => {
            next(createHttpError(err));
        });
});

router.get('/:userId/followers', function (req, res, next) {
    fetch(API_URL + `/user/${req.params.userId}`, {
        method: 'GET'
    }).then((response) => response.json())
        .then((user) => {
            if (user.error)
                return next(createHttpError(user.error));

            const skip = ((parseInt(req.query.page) || 1) - 1) * recordsPerPage;
            fetch(API_URL + `/user/${req.params.userId}/followers?skip=${skip}&limit=${recordsPerPage}`, {
                method: 'GET'
            }).then((response) => response.json())
                .then((json) => {
                    if (json.error)
                        return next(createHttpError(user.error));

                    res.render('followList', {heading: `Подписчики ${user.firstName} ${user.lastName}`, currentPage: parseInt(req.query.page) || 1, totalPages: Math.max(Math.ceil(json.totalCount / recordsPerPage), 1), users: json.value}, (err, html) => {
                        if (err)
                            return next(createHttpError(err));

                        res.render('layout', {
                            title: `Подписчики ${user.firstName} ${user.lastName}. Social`,
                            customScripts: [],
                            main: html
                        });
                    });
                })
                .catch((err) => {
                    return next(createHttpError(err));
                });
        })
        .catch((err) => {
            return next(createHttpError(err));
        });
});

router.get('/:userId/following', function (req, res, next) {
    fetch(API_URL + `/user/${req.params.userId}`, {
        method: 'GET'
    }).then((response) => response.json())
        .then((user) => {
            if (user.error)
                return next(createHttpError(user.error));

            const skip = ((parseInt(req.query.page) || 1) - 1) * recordsPerPage;
            fetch(API_URL + `/user/${req.params.userId}/following?skip=${skip}&limit=${recordsPerPage}`, {
                method: 'GET'
            }).then((response) => response.json())
                .then((json) => {
                    if (json.error)
                        return next(createHttpError(user.error));

                    res.render('followList', {heading: `Подписки ${user.firstName} ${user.lastName}`, currentPage: parseInt(req.query.page) || 1, totalPages: Math.max(Math.ceil(json.totalCount / recordsPerPage), 1), users: json.value}, (err, html) => {
                        if (err)
                            return next(createHttpError(err));

                        res.render('layout', {
                            title: `Подписки ${user.firstName} ${user.lastName}. Social`,
                            customScripts: [],
                            main: html
                        });
                    });
                })
                .catch((err) => {
                    return next(createHttpError(err));
                });
        })
        .catch((err) => {
            return next(createHttpError(err));
        });
});

export default router;