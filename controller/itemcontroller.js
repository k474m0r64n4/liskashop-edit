var express = require('express');
var router = express.Router();
var fileUpload = require('express-fileupload');
var ObjectId = require('mongodb').ObjectId;
var Item = require('../db/item');
var User = require('../db/User');
var Review = require('../db/reviewModel');
var unique = require('array-unique');

var tag = [];
var count = 0;
var otheritms = [];
var category = [];

Item.aggregate([{$sample: {size: 4}}], function (err, ress) {
    otheritms = ress;
});



Item.find({  },{ tags: 1, _id: 0 }, function (err, result) {
    result.forEach(function (t) {
        t.tags.forEach(function (xxx) {
            tag.push(xxx);
        });
    });
});
Item.find({}, function(err, result) {
    count = result.length;
});



// Display list of all Items. front and back
exports.item_list = function(req, res) {

    var user = req.user;
    var current = 1;
    var limit = 12;
    var pages = parseInt((count / limit) + 0.9);
    var query = req.query;
    var key = "_id";
    var value = -1;
    var src;
    var find = {};

    var  sort = new Object();
    sort[key] = value;


    if(query.orderby){
        console.log(query);
        var q = query.orderby.split(' ');
        var key = q[0];
        var value = Number(q[1]);
        sort = new Object();
        sort[key] = value;
        console.log(sort);
    }

    if(query.search){
        find = new Object();
        src =  query.search   ;

        var help = {'$regex' : src, '$options' : 'i'};
        find.name = help;
        console.log(find);

    }




    Item.find( find , function(err, result) {
        if (err) {
            res.render('backend/items', {
                title: 'item List',
                data: ''
            })
        } else {
                res.render('itemlist', {
                    title: 'items List',
                    data: result,
                    user: user,
                    current: current,
                    pages: pages,
                    tags: unique(tag.slice(0,6)),
                    category: ""
                })
            }
    }).limit(limit).sort( sort )
};

// Display detail page for a specific Item. front and back
exports.item_detail = function(req, res) {
    var o_id = new ObjectId(req.params.id);

    Item.find({"_id": o_id}, function(err, result) {
        if (err) {
            res.render('backend/updateitem', {
                title: 'item List',
                data: ''
            })
        } else {
            Review.find({ "itemIds": o_id }, function (err, revs) {
            console.log(revs.length);
            res.render('itemsingle', {
                title: 'items List',
                data: result,
                user: req.user,
                revs: revs,
                data2: otheritms
            })
            });
        }
    })
};

exports.item_pages = function(req, res) {
    var current = req.params.p;
    var limit = 12;
    var skip = limit * (current-1);
    var pages = parseInt((count / limit) + 0.9);

        req.db.collection('items').find().limit(limit).skip(skip).sort({"_id": -1}).toArray(function (err, result) {
            if (err) {
                console.log(err);
            } else {
                res.render('itemlist', {
                    title: 'items List',
                    data: result,
                    user: req.user,
                    current: current,
                    tags: unique(tag.slice(0, 6)),
                    pages: pages
                })
            }
        })
};



// Display list of items for a specific category
exports.item_category = function(req, res) {
    var cat = req.params.cat;

        req.db.collection('items').find({category: cat}).sort({"_id": -1}).toArray(function (err, result) {
                if (err) {
                    console.log(err);
                } else  {
                        res.render('itemlist', {
                            title: 'items List',
                            data: result,
                            user: req.user,
                            tags: unique(tag.slice(0, 6)),
                            current: 1,
                            pages: 0
                        })
                    }
            })
};

// Display list of items for a specific category
exports.item_tag = function(req, res) {
    var t = req.params.tag;

        req.db.collection('items').find({tags: t}).sort({"_id": -1}).toArray(function (err, result) {
            res.render('itemlist', {
                title: 'items List',
                data: result,
                user: req.user,
                tags: unique(tag.slice(0, 6)),
                current: 1,
                pages: 0
            })
        });
};

// Display detail page for a specific Author.
exports.vendor_detail = function(req, res) {
    var name = req.params.name;
    User.find({"username": name}, function(err, result) {
        if (err) {
            console.log(err);
        } else  {
            Item.find({vendor:name}, function (err, itm) {
                res.render('vendor', {
                    title: 'Vendor List',
                    user: req.user,
                    data: result,
                    items: itm

                })

            });
        }
    })
};

// Display Item update form on GET. back
exports.item_list_get = function(req, res) {
    Item.find( {}, function(err, result) {
        res.render('backend/items', {
            title: 'Add New item',
            data: result,
            user: req.user
        })
    });
};

// Display Item create form on GET. back
exports.item_create_get = function(req, res) {
    res.render('backend/createitem', {
        title: 'Add New item',
        user: req.user,
        name: '',
        price: '',
        description: '',
        image: '',
        gallery:'',
        category:''
    })
};

// Handle Item create on POST. back
exports.item_create_post = function(req, res) {
    var today = new Date();
    var img = req.files.img;

    var item = {
        name: req.body.name,
        price: req.body.price,
        amount: req.body.amount,
        description: req.body.description,
        content_text:req.body.content_text,
        image: img.name,
        gallery: req.body.gallery,
        category: req.body.category,
        tags: req.body.tags,
        origin: req.body.origin,
        status:req.body.status,
        vendor: req.body.vendor
    };

    Item.findOne({
        name: item.name
    }, function (err, doc) {
        if (err) {
            res.status(500).send('error occured')
        } else {
            if (doc) {
                res.status(500).send('Item already exists')
            } else {
                img.mv("public/images/items/" + img.name, function (err) {
                    if (err)
                        return res.status(500).send(err);


                });

                        var tag = item.tags.split(",");

                        var record = new Item();
                        record.name = item.name;
                        record.price = item.price;
                        record.amount = item.amount;
                        record.description = item.description;
                        record.content_text = item.content_text;
                        record.image = item.image;
                        //record.gallery =  item.gallery ;
                        record.category = item.category;
                        record.tags = tag;
                        record.origin = item.origin;
                        record.status = item.status;
                        record.vendor = item.vendor;
                        record.createdOn = today;

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


// Handle Item delete on POST.
exports.item_delete_post = function(req, res) {
    var o_id = new ObjectId(req.params.id);
    req.db.collection('items').remove({"_id": o_id}, function(err, result) {
        res.redirect('/admin')

    })
};

// Display Item update form on GET. back
exports.item_update_get = function(req, res) {
    var o_id = new ObjectId(req.params.id);
    req.db.collection('items').find({ "_id": o_id  }).toArray(function(err, result) {
        res.render('backend/updateitem', {
            title: 'Add New item',
            data: result,
            user: req.user
        })
    });
};

// Handle Item update on POST. back
exports.item_update_post = function(req, res) {
    var o_id = new ObjectId(req.body.id);

    req.db.collection('items').update(
        { "_id": o_id  },
        { $set : {
                name: req.body.name,
                price: req.body.price,
                amount: req.body.amount,
                description: req.body.description,
                content_text:req.body.content_text,
                image: req.body.image,
               // gallery: req.body.gallery,
                category: req.body.category,
                //tags: req.body.tags,
                origin: req.body.origin,
                status:req.body.status
        } },
        {multi: true, upsert: true }
        );
    res.redirect('/admin');

};


// Handle Item update on POST. back
exports.item_upload_post = function(req, res) {
     var img = req.files.img;
    img.mv("public/images/slike/" + img.name, function (err) {
        if (err)
            return res.status(500).send(err);


    });


};


