var express = require('express');
var router = express.Router();
var Itemsss = require('../db/item');
var ObjectId = require('mongodb').ObjectId;
var unique = require('array-unique');


module.exports.getTest = function(req, res) {
    var item = {
        name: req.body.name,
        price: req.body.price,
        description: req.body.description,
        image: req.body.image,
        gallery: req.body.gallery,
        category: req.body.category
    };

    Itemsss.findOne({
        name: item.name
    }, function (err, doc) {
        if (err) {
            res.status(500).send('error occured')
        } else {
            if (doc) {
                res.status(500).send('Item already exists')
            } else {
                var record = new Itemsss();
                record.name = item.name;
                record.price = item.price;
                record.description = item.description;
                record.image = item.image;
                record.gallery = [["item", "2"], ["item2", "1"], ["item3", "4"]];
                record.category = item.category;

                record.save(function (err, items) {
                    if (err) {
                        res.status(500).send('db error')
                    } else {
                        res.redirect('/admin')
                    }
                })
            }
        }
    })


};


// Get All Items, render Update list
module.exports.getItems = function(req, res) {
    req.db.collection('items').find().sort({"_id": -1}).toArray(function(err, result) {
        if (err) {
            res.render('backend/items', {
                title: 'item List',
                data: ''
            })
        } else {
            var user = req.user;
            if (user && user.username === "boris") {
                res.render('backend/items', {
                    title: 'items List',
                    data: result
                })
            }else{
                var r = [];
                result.forEach(function (g) {
                    r.push(g.category) ;
                });
                console.log(result);

                res.render('itemlist', {

                    title: 'items List',
                    data: result,
                    category: unique(r)
                })
            }

        }
    })
};
// Get Single Item, render Update single
module.exports.getItemsingle = function(req, res) {
    var o_id = new ObjectId(req.params.id);
    req.db.collection('items').find({"_id": o_id}).toArray(function(err, result) {
        if (err) {
            res.render('backend/updateitem', {
                title: 'item List',
                data: ''
            })
        } else {
            console.log(result);
            res.render('itemsingle', {
                title: 'items List',
                data: result
            })
        }
    })
};

module.exports.getCategory = function(req, res) {
    var o_id = req.params.cat;
    var category = [];
        req.db.collection('items').find({ category: o_id }).sort({"_id": -1}).toArray(function(err, result) {

            req.db.collection('items').find().toArray(function(err, result2) {
                result2.forEach(function (g) {
                    category.push(g.category) ;
                });

        if (err) {
            res.render('backend/items', {
                title: 'item List',
                data: ''
            })
        } else {
            var user = req.user;
            if (user && user.username === "boris") {
                res.render('backend/items', {
                    title: 'items List',
                    data: result
                })
            }else{
                console.log(unique(category));

                res.render('itemlist', {

                    title: 'items List',
                    data: result,
                    category: unique(category)
                })
            }

        }
    })
        });

};


// Get Create Item page, render create item
module.exports.getCreateItem = function(req, res) {
    res.render('backend/createitem', {
        title: 'Add New item',
        name: '',
        price: '',
        description: '',
        image: '',
        gallery:'',
        category:''
    })
};
// Post Create Item
module.exports.addItem = function(req, res) {
    var item = {
        name: req.body.name,
        price: req.body.price,
        description: req.body.description,
        image: req.body.image,
        gallery: req.body.gallery,
        category: req.body.category
    };

    req.db.collection('items').insert(item, function(err, result) {
        console.log('success', 'Data added successfully!');
        res.redirect('backend/admin');
    })
};

module.exports.deleteItem = function(req, res) {
    var o_id = new ObjectId(req.params.id);
    console.log(o_id);
    req.db.collection('items').remove({"_id": o_id}, function(err, result) {

            res.redirect('/admin/update')

    })
};







