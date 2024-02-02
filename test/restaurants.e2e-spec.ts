import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { getConnectionToken, MongooseModule } from '@nestjs/mongoose';
import { RESTAURANTS_PLURAL_NOT_FOUND, RESTAURANT_DELETED, RESTAURANT_SINGULAR_NOT_FOUND } from './../src/restaurants/restaurants.responses';

describe('RestaurantsController E2E Test', () => {
    let app: INestApplication;

    beforeAll (async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [
                // MongooseModule.forRootAsync({
                //     useFactory: () => ({
                //       uri: 'mongodb://127.0.0.1:27017/test',
                //       name: 'testing_connection',            
                //     })
                //   }),  
                AppModule
            ],
        }).compile();

        app = moduleFixture.createNestApplication();
        app.setGlobalPrefix("api/v1");
        await app.init();
    });

    afterAll(async () => {
        const connection = app.get(getConnectionToken());
        const collections = await connection.db.collections();

        for (const collection of collections) {
            await collection.deleteMany({});
        }
    });

    describe("Fetch Restaurants", () => {
        it("returns error because of an empty database", () => {
        return request(app.getHttpServer())
            .get('/api/v1/restaurants?city=New York&longitude=-74.0055&latitude=40.7112&distance=1000')
            .expect(({body}) => {
                expect(body.message).toEqual(RESTAURANTS_PLURAL_NOT_FOUND)
            })
            .expect(404);
        });
    });

    const restaurant = {
        name: "Cafe Delight",
        address: "123 Main St, New York, NY",
        city: "New York",
        latitude: 40.7112,
        longitude: -74.0055
    }

    const updateRestaurant = {
        name: "Gotham Restaurants",
        address: "12 E 12th St, New York, NY",
        city: "New York",
        latitude: 40.7340,
        longitude: -73.9937
    }

    let addedRestaurantId: string;

    describe("Add Restaurant", () => {

        it("returns the added restaurant instance", () => {
            return request(app.getHttpServer())
            .post('/api/v1/restaurants')
            .send(restaurant)
            .expect(201)
            .expect(({body}) => {
                addedRestaurantId = body.id;
            });
        });

        it("returns an error when you try to add an existing restaurant ", () => {
            return request(app.getHttpServer())
            .post('/api/v1/restaurants')
            .send(restaurant)
            .expect(400);
        });

        it("returns an error when you try to add a new restaurant with existing coordinates", () => {
            return request(app.getHttpServer())
            .post('/api/v1/restaurants')
            .send({
                ...restaurant,
                name: "New restaurant",
                address: "new address",
                city: "Another city"
            })
            .expect(400);
        });
    });

    describe("Fetch Restaurants", () => {
        it("returns restaurants that match the query parameters", () => {
        return request(app.getHttpServer())
            .get('/api/v1/restaurants?city=New York&longitude=-74.0055&latitude=40.7112&distance=1000')
            .expect(({body}) => {
                const [firstRestaurant] = body;
                expect(firstRestaurant.longitude).toEqual(restaurant.longitude);
                expect(firstRestaurant.latitude).toEqual(restaurant.latitude);
                expect(firstRestaurant.id).toEqual(addedRestaurantId);

            })
            .expect(200);
        });
    });

    describe("Fetch Single Restaurant", () => {
        it("returns the restaurant instance with the id", () => {
            return request(app.getHttpServer())
            .get(`/api/v1/restaurants/${addedRestaurantId}`)
            .expect(200)
            .expect(({body}) => {
                expect(body.id).toEqual(addedRestaurantId);
            });
        });

        it("returns an error when you try to access a restaurant with non-existent id", () => {
            return request(app.getHttpServer())
            .get(`/api/v1/restaurants/${addedRestaurantId}90`)
            .expect(404)
            .expect(({body}) => {
                expect(body.message).toEqual(RESTAURANT_SINGULAR_NOT_FOUND)
            });
        });
    });

    describe("Update Single Restaurant", () => {
        it("updates the restaurant instance with the id", () => {
            return request(app.getHttpServer())
            .put(`/api/v1/restaurants/${addedRestaurantId}`)
            .send(updateRestaurant)
            .expect(200)
            .expect(({body}) => {
                console.log(body);
                expect(body.id).toEqual(addedRestaurantId);
                expect(body.longitude).toEqual(updateRestaurant.longitude);
                expect(body.latitude).toEqual(updateRestaurant.latitude);
            });
        });

        it("returns an error when you try to access a restaurant with non-existent id", () => {
            return request(app.getHttpServer())
            .put(`/api/v1/restaurants/${addedRestaurantId}90`)
            .send(updateRestaurant)
            .expect(404)
            .expect(({body}) => {
                expect(body.message).toEqual(RESTAURANT_SINGULAR_NOT_FOUND)
            });
        });
    });

    describe("Delete Single Restaurant", () => {
        it("deletes the restaurant instance with the id", () => {
            return request(app.getHttpServer())
            .delete(`/api/v1/restaurants/${addedRestaurantId}`)
            .expect(200)
            .expect(({body}) => {
                expect(body.response).toEqual(RESTAURANT_DELETED);
            });
        });

        it("returns an error when you try to access a restaurant with non-existent id", () => {
            return request(app.getHttpServer())
            .delete(`/api/v1/restaurants/${addedRestaurantId}90`)
            .expect(404)
            .expect(({body}) => {
                expect(body.message).toEqual(RESTAURANT_SINGULAR_NOT_FOUND)
            });
        });
    });
});