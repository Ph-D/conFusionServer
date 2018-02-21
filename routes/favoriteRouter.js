
const express = require('express');
const bodyParser = require('body-parser');

const mongoose = require('mongoose');

const Favorite = require('../models/favorite');

const favoriteRouter = express.Router();

const authenticate = require('../authenticate');

favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/')
.get(authenticate.verifyUser, (req, res, next) => {
    Favorite.find({'user': req.user})
    .populate('user')
    .populate('dishes')
    .then((favorite) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(favorite);
    }, (err) => next(err))
    .catch((err) => next(err));
})

.post(authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({
        'user': req.body.user
    }).then((favorite) => {
        favorite.dishes.push(req.body._id);
        favorite.user = req.user._id;
        if (!favorite) {
            Favorite.create(req.body)
            .then((favorite) => {

                console.log("Log " + req.body.user );
                favorite.user = req.user._id;
               console.log(favorite);
               //console.log("log2" + req.body.user._id);
               favorite.dishes.push(req.body);
            })  .then((dish) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
               
                res.json(dish);                
            }, (err) => next(err));
                
        } else {
            var dish = req.body._id;
            console.log("Log " + req.user._id + " " + favorite );
            if (favorite.dishes.indexOf(dish) == -1) {
               // favorite.dishes.push(dish);
            }
            favorite.save()
                .then((dish) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(dish);                
                }, (err) => next(err));
            
        }
    })
     
})


.delete(authenticate.verifyUser,(req,res,next) => {
    Favorite.remove({})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);   
    },  (err) => next(err))
    .catch((err) => next(err));
});


favoriteRouter.route('/:dishId')
.post(authenticate.verifyUser, (req, res, next) => {
Favorite.findOne({'user': req.body.user})

// if (!favorite) {
//     Favorite.create(req.body)
//     .then((favorite) => {

//         console.log("Log " + req.body.user );
//         favorite.user = req.user._id;
//        console.log(favorite);
//        //console.log("log2" + req.body.user._id);
//        favorite.dishes.push(req.body);
//     })  .then((dish) => {
//         res.statusCode = 200;
//         res.setHeader('Content-Type', 'application/json');
       
//         res.json(dish);                
//     }, (err) => next(err));
        
// } else {
//     var dish = req.body._id;
//     console.log("Log " + req.user._id + " " + favorite );
//     if (favorite.dishes.indexOf(dish) == -1) {
//        // favorite.dishes.push(dish);
//     }
//     favorite.save()
//         .then((dish) => {
//             res.statusCode = 200;
//             res.setHeader('Content-Type', 'application/json');
//             res.json(dish);                
//         }, (err) => next(err));
    
// }






    .then((favorite) => {
        if(favorite != null){

            var dish = req.body._id;
    console.log("Log " + req.user._id + " " + favorite );
    if (favorite.dishes.indexOf(dish) == -1) {
        favorite.dishes.push(req.params.dishId);
    }
    favorite.save()
        .then((dish) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(dish);                
        }, (err) => next(err));

            
            
        }
        else {
    
            Favorite.create(req.body)
            .then((favorite) => {
                req.body.user = req.user._id;
                console.log("test1 " + req.body.user);
                console.log("test2 " + req.params.dishId);
                favorite.user =  req.body.user;
                favorite.dishes.push(req.params.dishId);
                favorite.save()
                .then((favorite) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(favorite);                
                     }, (err) => next(err));
                })
        }

       
            
       
    })
        

       
    
    
    
    
    


    })





.delete(authenticate.verifyUser,(req, res, next) => {
    Favorite.findByIdAndRemove(req.params.favoriteId)
    .then((favorite) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(favorite);
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = favoriteRouter;
