import { Request} from "express"
  

export interface MulterReq extends Request{
        files: {[fieldname: string] : Express.Multer.File[]}
}