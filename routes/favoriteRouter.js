
const express = require('express');
const bodyParser = require('body-parser');

const mongoose = require('mongoose');

const Favorite = require('../models/favorite');

const favoriteRouter = express.Router();

const authenticate = require('../authenticate');

favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/')
.get(authenticate.verifyUser, (req, res, next) => {
    Favorite.find({})
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
     Favorite.create(req.body)
                .then((favorite) => {
                    req.body.user = req.user._id;
                    favorite.user =  req.body.user;
                    //favorite.dishes.push(req.body);
                    //favorite.save();
                    res.statusCode = 200;
                    res.setHeader('Content-Type','application/json');
                    res.json(favorite);
              
           
       
    }, (err) => next(err))
    .catch((err) => next(err));
    
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
        Favorite.findById(req.params.dishId)
        .then((favorite) => {
            if(favorite != null && favorite.user != null){
                req.body.user = req.user._id;
                favorite.user =  req.body.user;
                favorite.dishes.push(req.params.dishId);
                favorite.save()
                .then((favorite) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type','application/json');
                    res.json(favorite);
                })
            } else {
                console.log("empty value");
                Favorite.create(req.body)
                .then((favorite) => {
                    req.body.user = req.user._id;
                    favorite.user =  req.body.user;
                    favorite.dishes.push(req.params.dishId);
                    favorite.save();
                    res.statusCode = 200;
                    res.setHeader('Content-Type','application/json');
                    res.json(favorite);
                })
            }
        }, (err) => {
            return next(err);
        })

                // Favorite.create(req.body)
                // .then((favorite) => {
                // req.body.user = req.user._id;
                // console.log("test1 " + req.body.user);
                // console.log("test2 " + req.params.dishId);
                // favorite.user =  req.body.user;
                // favorite.dishes.push(req.body);
                // favorite.save()
                // .then((favorite) => {
                //         res.statusCode = 200;
                //         res.setHeader('Content-Type', 'application/json');
                //         res.json(favorite);                
                //      }, (err) => next(err));
                // })
            



    //     if(favorite != null){
           
    //         Favorite.findById(req.params.dishId)
    //         .then((favorite) => {
    //             for(var key in req.body){
    //                  var index = favorite.dishes.indexOf(req.body[key]);
    //                 console.log(index);
    //                 if (index == -1){
                        
    //                     //favorite.dishes.push(req.params.dishId);
    //                     favorite.save()
    //                     console.log('Favorite added!');
    //                 }
    //             }
    //         })
            
    //     }

    //     else {

    //         Favorite.create(req.body)
    //         .then((favorite) => {
    //             req.body.user = req.user._id;
    //             console.log("test1 " + req.body.user);
    //             console.log("test2 " + req.params.dishId);
    //             favorite.user =  req.body.user;
    //             favorite.dishes.push(req.body);
    //             favorite.save()
    //             .then((favorite) => {
    //                     res.statusCode = 200;
    //                     res.setHeader('Content-Type', 'application/json');
    //                     res.json(favorite);                
    //                  }, (err) => next(err));
    //             })
    //     }
 
    // })

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
