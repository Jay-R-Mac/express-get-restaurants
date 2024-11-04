const express = require("express");
const app = express();
const Restaurant = require("../models/index")
const db = require("../db/connection");

app.use(express.json())
app.use(express.urlencoded({extended: true }))

//TODO: Create your GET Request Route Below: 
app.get('/restaurants', async (req, res) => {
    const restaurants = await Restaurant.findAll()
    res.json(restaurants)
})

//GET by id
app.get('/restaurants/:id', async (req, res) => {
    const id = (req.params.id)
    const restaurant = await Restaurant.findByPk(id)
    res.json(restaurant)
})
//new restaurant
app.post('/restaurants/new', async (req, res) => {
    let newRestaurant = await Restaurant.create({
        name: 'Yo-Sushi',
        location: 'Leeds',
        cuisine: 'Japanese'
      });
    res.json(newRestaurant)
})
//Update
app.put('/restaurants/:id', async (req, res) => {
    const restaurant = await Restaurant.update(req.body, {where:{id: req.params.id}})
    res.json(restaurant)
})
//Delete
app.delete('/restaurants/:id', async (req, res) => {
    let restaurant = await Restaurant.findByPk(req.params.id)
    await restaurant.destroy()
    res.send('Restaurant successfully deleted')
})


module.exports = app;