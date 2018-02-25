
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Favorite = require('../models/favorite');
const favoriteRouter = express.Router();
const authenticate = require('../authenticate');

favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/')
.get(authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({'user': req.user._id})
    .populate('user')
    .populate('dishes')
    .then((favorite) => {
        if (favorite) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(favorite);
        } else {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(null);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})

.post(authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({
        'user': req.user._id
    }).then((favorite) => {
         if (!favorite) {
            Favorite.create(req.user._id)
            .then((favorite) => {
               favorite.user = req.user._id;
               favorite.dishes = req.body;
               favorite.save()
               .then((favorite) => {
                   res.statusCode = 200;
                   res.setHeader('Content-Type', 'application/json');
                   res.json(favorite);                
               }, (err) => next(err))
               .catch((err) => next(err));
            })
        }
        else {
            Favorite.findOne({'user': req.user._id})
            .then((favorite) => {
                for(var i = 0; i < req.body.length; i++){
                    if (favorite.dishes.indexOf(req.body[i]._id) == -1) {
                        favorite.dishes.push(req.body[i]._id);
                        console.log(req.body[i]._id + " added to favorite")
                    } else {
                        console.log(req.body[i]._id + " already favorite")
                    }
                }
                favorite.save()
                .then((favorite) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favorite);                
                }, (err) => next(err))
                .catch((err) => next(err));
            })
        }
    })
})

.delete(authenticate.verifyUser,(req, res, next) => {
    Favorite.find({'user': req.user._id})
    .then((favorite) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(favorite);  
    }, (err) => next(err))
    .catch((err) => next(err))
    .then((favorite) => {
        Favorite.remove()
        .then((favorite) => { 
            console.log("Favorite is fully removed")
        },  (err) => next(err))
        .catch((err) => next(err));
    })

});


/////////:dishId

favoriteRouter.route('/:dishId')
.post(authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({
        'user': req.user._id
    }).then((favorite) => {
        if (!favorite) {
            Favorite.create(req.user._id)
            .then((favorite) => {
                favorite.user = req.user._id;
                favorite.dishes = req.params.dishId;
                console.log(req.params.dishId + " added to favorite")
                favorite.save()
                .then((favorite) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favorite);                
                }, (err) => next(err))
                .catch((err) => next(err));
            })
        } 
        else 
        {
            Favorite.findOne({'user': req.user._id})
            .then((favorite) => {
                if (favorite.dishes.indexOf(req.params.dishId) == -1) {
                    favorite.dishes.push(req.params.dishId);
                    console.log(req.params.dishId + " added to favorite");
                } else {
                    console.log(req.params.dishId + " already favorite");
                }
                favorite.save()
                .then((favorite) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favorite);                
                },  (err) => next(err))
                .catch((err) => next(err));
            })
        }   
    })
})

.delete(authenticate.verifyUser,(req, res, next) => {
   Favorite.findOne({'user': req.user._id})
    .then((favorite) => {
        if (favorite.dishes.indexOf(req.params.dishId) != -1) {
            favorite.dishes.splice(favorite.dishes.indexOf(req.params.dishId),1);
            console.log(req.params.dishId + " removed from favorite");
        } else {
            console.log(req.params.dishId + " not actually favorite");
        }
        favorite.save()
        .then((favorite) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(favorite);                
        }, (err) => next(err))
        .catch((err) => next(err));
    })
});



module.exports = favoriteRouter;
