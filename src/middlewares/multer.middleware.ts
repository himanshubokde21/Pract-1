import multer from 'multer'
import { Request } from 'express';
import fs from 'fs';
import path from 'path';

const tempDir = path.join(process.cwd(), 'public', 'temp');
if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
}

const localStorage = multer.diskStorage({
    destination: function (req: Request, file, cb) {
        cb(null, tempDir)
    },
    filename: function (req: Request, file, cb){
        cb(null, file.originalname)
    }
})

const localUpload = multer({
  storage: localStorage
})

export default localUpload

