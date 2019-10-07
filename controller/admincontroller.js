var express = require('express');
var router = express.Router();
var ObjectId = require('mongodb').ObjectId;


module.exports.getAdmin = function(req, res) {
    var user = req.user;
        if (user && user.username === "boris") {
            res.render('backend/admin', {
                title: 'Liska'
            });}


    else{
        res.redirect('/');
    }
};








