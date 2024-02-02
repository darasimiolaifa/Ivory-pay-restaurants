import { HttpException, HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';

@Injectable()
export class ValidateIdMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    
    if(!mongoose.Types.ObjectId.isValid(id))
      throw new HttpException('Restaurant not found', HttpStatus.NOT_FOUND);
    
    next();
  }
}
