import { Response, Request, NextFunction } from "express";

const Asynchandler = (requestHandler: Function) => {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err))
    }
}

export default Asynchandler