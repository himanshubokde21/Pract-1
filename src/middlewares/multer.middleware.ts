import multer from 'multer'
import { Request } from 'express';
import fs from 'fs';
import path from 'path';


const localStorage = multer.diskStorage({
    destination: function (req: Request, file, cb) {
        cb(null, path.join(
            process.cwd(), "public", "temp"
        ));
    },
    filename: function (req: Request, file, cb){
        cb(null, file.originalname)
    }
})

const localUpload = multer({
  storage: localStorage
})

export default localUpload

