import { IsAlphanumeric, IsLatitude, IsLongitude, IsNotEmpty, IsString } from "class-validator";

export class AddRestaurantDTO {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    address: string;

    @IsNotEmpty()
    @IsString()
    city: string;

    @IsNotEmpty()
    @IsLatitude()
    latitude: number;

    @IsNotEmpty()
    @IsLongitude() 
    longitude: number;
}