var express = require('express');
var router = express.Router();

// var p = require('../models/author');

// Display list of all Users.
exports.profile_list = function(req, res) {
    req.db.collection('users').find().sort({"_id": -1}).toArray(function(err, result) {
        if (err) {
            res.render('backend/userlist', {
                title: 'item List',
                data: ''
            })
        } else {
            res.render('profile', {
                title: 'items List',
                data: result
            })
        }
    })
};

// Display detail page for a specific Author.
exports.profile_detail = function(req, res) {
    res.send('NOT IMPLEMENTED: Author detail: ' + req.params.id);
};

// Display Author create form on GET.
exports.profile_create_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Author create GET');
};

// Handle Author create on POST.
exports.profile_create_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Author create POST');
};

// Display Author delete form on GET.
exports.profile_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Author delete GET');
};

// Handle Author delete on POST.
exports.profile_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Author delete POST');
};

// Display Author update form on GET.
exports.profile_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Author update GET');
};

// Handle Author update on POST.
exports.profile_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Author update POST');
};