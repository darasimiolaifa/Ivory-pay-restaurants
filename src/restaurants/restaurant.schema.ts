import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
  
@Schema()
export class Restaurant {
    @Prop({ required: true})
    name: string;

    @Prop({ required: true})
    address: string;

    @Prop({ required: true})
    city: string;

    @Prop({
        type: {
            type: String,
            enum: ["Point"],
            required: true,
        },
        coordinates: {
            type: [Number],
            required: true,
        },
    })
    location: object;
}

export const RestaurantSchema = SchemaFactory.createForClass(Restaurant);
RestaurantSchema.index({ location: "2dsphere" });