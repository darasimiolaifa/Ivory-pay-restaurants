import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, ParseUUIDPipe, Post, Put, Query, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import mongoose from 'mongoose';
import { AddRestaurantDTO } from './dto/AddRestaurant.dto';
import { FilterRestaurantDTO } from './dto/filterRestaurant.dto';
import { RestaurantInterceptor } from './interceptors/restaurant.interceptor';
import {
    RESTAURANT_ALREADY_EXISTS,
    RESTAURANTS_PLURAL_NOT_FOUND,
    RESTAURANT_DELETED,
    RESTAURANT_SINGULAR_NOT_FOUND
} from './restaurants.responses';
import { RestaurantsService } from './restaurants.service';

@Controller('restaurants')
@UseInterceptors(RestaurantInterceptor)
export class RestaurantsController {
    constructor(private readonly restaurantService: RestaurantsService) {}
    
    @Get()
    @UsePipes(new ValidationPipe())
    async findRestaurants(
        @Query() restaurantsSearchFilter: FilterRestaurantDTO
    ) {
        const restaurants = await this.restaurantService.findRestaurants(restaurantsSearchFilter);

        if(restaurants.length === 0)
            throw new HttpException(RESTAURANTS_PLURAL_NOT_FOUND, HttpStatus.NOT_FOUND);

        return restaurants;
    }

    @Post()
    @UsePipes(new ValidationPipe())
    async addRestaurant(@Body() addRestaurantDTO: AddRestaurantDTO) {
        const { longitude, latitude } = addRestaurantDTO;
        const existingRestaurant = await this.restaurantService.checkExistingLocation(longitude, latitude);

        if(existingRestaurant) throw new HttpException(RESTAURANT_ALREADY_EXISTS, HttpStatus.BAD_REQUEST);

        return this.restaurantService.addRestaurants(addRestaurantDTO);
    }

    @Get(":id")
    @UsePipes(new ValidationPipe())
    async findSingleRestaurant(@Param("id") id: string) {
        const restaurant = await this.restaurantService.findSingleRestaurant(id);
        if(!restaurant) throw new HttpException(RESTAURANT_SINGULAR_NOT_FOUND, HttpStatus.NOT_FOUND);

        return restaurant;
    }

    @Put(":id")
    @UsePipes(new ValidationPipe())
    async updateSingleRestaurant(
        @Param("id") id: string,
        @Body() updateRestaurantDTO: AddRestaurantDTO
    ) {
        const updatedRestaurant = await this.restaurantService.updateSingleRestaurant(id, updateRestaurantDTO);
        if(!updatedRestaurant) throw new HttpException(RESTAURANT_SINGULAR_NOT_FOUND, HttpStatus.NOT_FOUND);

        return updatedRestaurant;
    }

    @Delete(":id")
    @UsePipes(new ValidationPipe())
    async DeleteSingleRestaurant(@Param("id") id: string) {
        const deletedRestaurant = await this.restaurantService.deleteSingleRestaurant(id);
        if(!deletedRestaurant) throw new HttpException(RESTAURANT_SINGULAR_NOT_FOUND, HttpStatus.NOT_FOUND);
        
        return { response : RESTAURANT_DELETED };
    }
}
