const request = require("supertest");
const app = require("./src/app");
const Restaurant = require("./models/Restaurant");

describe("Restaurants API", () => {
    beforeAll(async () => {
        await Restaurant.bulkCreate([
            { name: "Yo-Sushi", location: "Leeds", cuisine: "Japanese" },
            { name: "AppleBees", location: "Texas", cuisine: "FastFood" },
            { name: "Sushi Planet", location: "Tokyo", cuisine: "Japanese" }
        ]);
    });

    afterAll(async () => {
        await Restaurant.destroy({ where: {} });
    });

    test("GET /restaurants should return status 200", async () => {
        const response = await request(app).get("/restaurants");
        expect(response.status).toBe(200);
    });

    test("GET /restaurants should return an array of restaurants", async () => {
        const response = await request(app).get("/restaurants");
        expect(Array.isArray(response.body)).toBe(true);
    });

    test("GET /restaurants should return the correct number of restaurants", async () => {
        const response = await request(app).get("/restaurants");
        expect(response.body.length).toBe(3); 
    });

    test("GET /restaurants should return the correct restaurant data", async () => {
        const response = await request(app).get("/restaurants");
        expect(response.body[0]).toMatchObject({
            name: "Yo-Sushi",
            location: "Leeds",
            cuisine: "Japanese"
        });
    });

    test("GET /restaurants/:id should return the correct data", async () => {
        const restaurant = await Restaurant.findOne({ where: { name: "Yo-Sushi" } });
        const response = await request(app).get(`/restaurants/${restaurant.id}`);
        expect(response.body).toMatchObject({
            name: "Yo-Sushi",
            location: "Leeds",
            cuisine: "Japanese"
        });
    });

    test("POST /restaurants/new should add a new restaurant and return it", async () => {
        const newRestaurantData = { name: "Restaurant C", location: "City C", cuisine: "Chinese" };
        const response = await request(app).post("/restaurants/new").send(newRestaurantData);

        const allRestaurants = await request(app).get("/restaurants");
        expect(allRestaurants.body.length).toBe(4);  
    });

    test("PUT /restaurants/:id should update a restaurant's data", async () => {
        const restaurant = await Restaurant.findOne({ where: { name: "Yo-Sushi" } });
        const updatedData = { name: "Updated Yo-Sushi", location: "Updated Leeds", cuisine: "Updated Japanese" };
        const response = await request(app).put(`/restaurants/${restaurant.id}`).send(updatedData);

        const updatedRestaurant = await request(app).get(`/restaurants/${restaurant.id}`);
        expect(updatedRestaurant.body).toMatchObject(updatedData);
    });

    test("DELETE /restaurants/:id should delete the restaurant", async () => {
        const restaurant = await Restaurant.findOne({ where: { name: "Updated Yo-Sushi" } });
        await request(app).delete(`/restaurants/${restaurant.id}`);

        const response = await request(app).get("/restaurants");
        expect(response.body.length).toBe(3);
    });
});
