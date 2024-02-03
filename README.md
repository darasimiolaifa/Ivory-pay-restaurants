# Ivory-Pay Restaurants

An API for managing and searching for restaurants based on geo-location.

## Project Overview

Based on your location and a city input, you can search for restaurants within a specified distance.

It is built with NestJs and MongoDb as the underlying strage.

### API Endpoints.

S/N | Verb   | Endpoint                  | Description                                     |
---:| -------|---------------------------|-------------------------------------------------|
  1 | Get    | /api/v1/restaurants       | Get restaurants that match the query parameters |
  2 | Post   | /api/v1/restaurants       | Add a restaurant                                |
  3 | Get    | /api/v1/restaurants/:id   | Get a single restaurant                         |
  4 | Put    | /api/v1/restaurants/:id   | Update the details of a restaurant              |
  5 | Delete | /api/v1/restaurants/:id   | Delete a restaurant                             |


### Hosted Documentation

The API's documentation is here: [Documentation](https://documenter.getpostman.com/view/6100068/2s9YyvBfZ1#fc8991ac-7f2e-4113-a7e7-10ad0f7e5186)

### How To Set Up Locally

1. Clone repo by opening a terminal and running `git clone https://github.com/darasimiolaifa/Ivory-pay-restaurants.git`
2. Change into the project directory by running `cd Ivory-pay-restaurants`
3. Start a MongoDb instance
4. Create a .env file based on the .env.example file and fill in the variables
3. Run `yarn` or `npm install`
4. Run `yarn start:dev` or `npm start:dev`
5. The API should be available at `http://localhost:3000`

### Author

Darasimi Olaifa