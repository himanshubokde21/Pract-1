import multer from 'multer'
import { Request } from 'express';
import ApiError from "../utils/ApiError.util";

// const localFileFilter = (
//   req: Request, 
//   file: Express.Multer.File, 
//   cb: multer.FileFilterCallback
// ) => {
//   if (file.mimetype.startsWith("image/")) {
//     cb(null, true);
//   } else {
//     cb(new ApiError(400, "Only images are allowed"));
//   }
// };

const localStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "../public/temp")
    },
    filename: function (req, file, cb){
        cb(null, Date.now() + "-" + file.originalname)
    }
})

const localUpload = multer({
  storage: localStorage,
  // fileFilter: localFileFilter,
})

export {
    localUpload,
}

