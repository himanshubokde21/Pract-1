import multer from 'multer'
import { Request } from 'express';
import fs from 'fs';
import path from 'path';


const localStorage = multer.diskStorage({
    destination: function (req: Request, files, cb) {
        cb(null, path.join(
            process.cwd(), "public", "temp"
        ));
    },
    filename: function (req: Request, files, cb){
        cb(null, files.originalname)
    }
})

const localUpload = multer({
  storage: localStorage
})

export default localUpload

