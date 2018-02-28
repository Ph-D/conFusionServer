const express = require('express');
const bodyParser = require('body-parser');

const moongoose = require('mongoose');

const Promotions = require('../models/promotions');

const promoRouter = express.Router();
const cors = require('./cors');

var authenticate = require('../authenticate');

promoRouter.use(bodyParser.json());

promoRouter.route('/')
.options(cors.corsWithOptions, (req,res) => { res.sendStatus(200); })
    .get(cors.cors, (req,res,next) => {
        Promotions.find(req.query)
        .then((promotions) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(promotions);
        }, (err) => next(err))
        .catch((err) => (err));
    })

    .post(authenticate.verifyUser, (req,res,next) => {
        Promotions.create(req.body)
        .then((promotion) => {
            console.log('Promotion Created ', promotion);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(promotion);
        }, (err) => next(err))
        .catch((err) => next(err));
    })

    .put(authenticate.verifyUser,  (req,res,next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /promotions');
    })

    .delete(authenticate.verifyUser, (req,res,next) => {
        Promotions.remove({})
        .then((resp) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(resp);   
        },  (err) => next(err))
        .catch((err) => next(err));
    });

promoRouter.route('/:promoId')
.options(cors.corsWithOptions, (req,res) => { res.sendStatus(200); })
    .get(cors.cors,(req,res,next) => {
        Promotions.findById(req.params.promoId)
        .then((promotion) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(promotion);
        }, (err) => (err))
        .catch((err) => next(err));
    })
    
    .post(authenticate.verifyUser, (req, res, next) => {
      res.statusCode = 403;
      res.end('POST operation not supported on /promotions/'+ req.params.promoId);
    })
    
    .put(authenticate.verifyUser,(req, res, next) => {
        Promotions.findByIdAndUpdate(req.params.promoId, {
            $set: req.body
        }, { new: true })
        .then((promotion) => {
           res.statusCode = 200;
           res.setHeader('Content-Type', 'application/json');
           res.json(promotion);
       }, (err) => next(err))
       .catch((err) => next(err));
    })
    
    .delete(authenticate.verifyUser, (req, res, next) => {
        Promotions.findByIdAndRemove(req.params.promoId)
        .then((promotion) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(promotion);
        }, (err) => next(err))
        .catch((err) => next(err));
    });





module.exports = promoRouter;