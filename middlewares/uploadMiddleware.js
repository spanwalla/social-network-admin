import multer from "multer";
import path from "path";

const imageStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join('uploads', 'images')); // Папка для сохранения файлов
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const imageFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Images are only allowed.'), false);
    }
};

export const uploadImage = multer({
    storage: imageStorage,
    fileFilter: imageFilter,
    limits: {fileSize: 5 * 1024 * 1024} // Ограничение на размер файла в 5 Мб
});