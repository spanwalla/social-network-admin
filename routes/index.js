import express from 'express';
const router = express.Router();

router.get('/', function (req, res) {
    res.redirect("/users/all");
});

export default router;