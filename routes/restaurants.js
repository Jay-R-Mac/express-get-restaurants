const { Router } = require("express")
const restaurantRouter = Router()
const Restaurant = require('../models/Restaurant')

restaurantRouter.get('/', async (req, res) => {
    const restaurants = await Restaurant.findAll()
    res.json(restaurants)
})

restaurantRouter.get('/:id', async (req, res) => {
    const restaurant = await Restaurant.findByPk(req.params.id);
    res.json(restaurant);
});

restaurantRouter.post('/new', async (req, res) => {
    const { name, location, cuisine } = req.body; // Get data from the request body

    const newRestaurant = await Restaurant.create({
        name: name,
        location: location,
        cuisine: cuisine
    });

    res.json(newRestaurant); // Return the created restaurant data
});

restaurantRouter.put('/:id', async (req, res) => {
    await Restaurant.update(req.body, {
        where: { id: req.params.id }
    });
    const updatedRestaurant = await Restaurant.findByPk(req.params.id);
    res.json(updatedRestaurant);
});

restaurantRouter.delete('/:id', async (req, res) => {
    const restaurant = await Restaurant.findByPk(req.params.id);
    await restaurant.destroy();
    res.send("Restaurant successfully deleted");
});


module.exports = restaurantRouter;