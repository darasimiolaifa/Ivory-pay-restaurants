import { HttpException, HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import { RESTAURANT_SINGULAR_NOT_FOUND } from '../restaurants.responses';

@Injectable()
export class ValidateIdMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    
    if(!mongoose.Types.ObjectId.isValid(id))
      throw new HttpException(RESTAURANT_SINGULAR_NOT_FOUND, HttpStatus.NOT_FOUND);
    
    next();
  }
}
