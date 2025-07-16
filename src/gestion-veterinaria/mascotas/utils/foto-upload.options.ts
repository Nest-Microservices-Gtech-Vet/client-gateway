import { BadRequestException } from '@nestjs/common';
import { diskStorage } from 'multer';
import { extname } from 'path';

export const fotoUploadOptions = {
    storage: diskStorage({
        destination: './uploads/perfil',
        filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
            const extension = extname(file.originalname);
            const fileName = `${uniqueSuffix}${extension}`;
            cb(null, fileName);
        },
    }),
    fileFilter: (req, file, cb) => {
        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp','image/avif'];

        if (!allowedMimeTypes.includes(file.mimetype)) {
            return cb(
                new BadRequestException('Tipo de archivo no permitido. Solo .jpg, .png, .webp'),
                false,
            );
        }

        cb(null, true);
    },
    limits: {
        fileSize: 2 * 1024 * 1024, // 2MB
    },
};
