import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ValidateIdMiddleware } from './middlewares/validate-id.middleware';
import { Restaurant, RestaurantSchema } from './restaurant.schema';
import { RestaurantsController } from './restaurants.controller';
import { RestaurantsService } from './restaurants.service';

@Module({
  imports: [MongooseModule.forFeature([{
    name: Restaurant.name,
    schema: RestaurantSchema
  }])],
  controllers: [RestaurantsController],
  providers: [RestaurantsService],
})
export class RestaurantsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ValidateIdMiddleware)
      .exclude(
        {
          path: "/restaurants",
          method: RequestMethod.POST
        },
        {
          path: "/restaurants",
          method: RequestMethod.GET
        },
      )
      .forRoutes(RestaurantsController)
  }
}
