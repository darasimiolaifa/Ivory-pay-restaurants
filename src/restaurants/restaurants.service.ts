import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AddRestaurantDTO } from './dto/AddRestaurant.dto';
import { FilterRestaurantDTO } from './dto/filterRestaurant.dto';
import { Restaurant } from './restaurant.schema';

@Injectable()
export class RestaurantsService {
    constructor(@InjectModel(Restaurant.name) private readonly restaurantModel: Model<Restaurant>){}

    addRestaurants(addRestaurantDTO: AddRestaurantDTO) {
        const newRestaurant = new this.restaurantModel({
            name: addRestaurantDTO.name,
            address: addRestaurantDTO.address,
            city: addRestaurantDTO.city.toLowerCase(),
            location: {
                type: 'Point',
                coordinates: [addRestaurantDTO.longitude, addRestaurantDTO.latitude]
            }
        });

        return newRestaurant.save();
    }

    findRestaurants(restaurantsSearchFilterDTO: FilterRestaurantDTO) {
        const {
            city,
            distance,
            longitude,
            latitude
        } = restaurantsSearchFilterDTO
        return this.restaurantModel.find({
            city: city.toLowerCase(),
            location: {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: [longitude, latitude]
                    },
                    $minDistance: 0,
                    $maxDistance: distance
                }
            }
        });
    }

    checkExistingLocation(longitude: number, latitude: number) {
        const location = {
            type: 'Point',
            coordinates: [longitude, latitude]
        }

        return this.restaurantModel.findOne({ location });
    }

    findSingleRestaurant(id: string) {
        return this.restaurantModel.findById(id);
    }

    updateSingleRestaurant(id: string, updateRestaurantDTO: AddRestaurantDTO) {
        return this.restaurantModel.findByIdAndUpdate(
            id,
            {
                name: updateRestaurantDTO.name,
                address: updateRestaurantDTO.address,
                city: updateRestaurantDTO.city.toLowerCase(),
                location: {
                    type: 'Point',
                    coordinates: [updateRestaurantDTO.longitude, updateRestaurantDTO.latitude]
                }
            },
            { new: true });
    }

    deleteSingleRestaurant(id: string) {
        return this.restaurantModel.findByIdAndDelete(id);
    }
}

// {
//     "name": "Gotham Restaurants",
//     "address": "12 E 12th St, New York, NY",
//     "latitude": 40.7340,
//     "longitude": -73.9937
// }
