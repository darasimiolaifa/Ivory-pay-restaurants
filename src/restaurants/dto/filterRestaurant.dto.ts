import { Transform } from "class-transformer";
import {IsLatitude, IsLongitude, IsNotEmpty, IsNumber, IsPositive, IsString, Min } from "class-validator";

export class FilterRestaurantDTO {
    @IsNotEmpty()
    @IsString()
    city: string;

    @IsNotEmpty()
    @IsNumber()
    @Transform(({value}) => Number(value))
    @Min(0)
    distance: number;

    @IsNotEmpty()
    @IsLatitude()
    latitude: number;

    @IsNotEmpty()
    @IsLongitude() 
    longitude: number;
}