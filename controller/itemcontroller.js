var ObjectId = require('mongodb').ObjectId;
var itemService = require('../services/itemService');
var reviewService = require('../services/reviewService');
var userService = require('../services/userService');
var unique = require('array-unique');

// Front
// List of all Items GET
exports.item_list = function(req, res) {
    var t = req.params.tag;
    var tag = [];
    var count = 0;
    var pages = 1;
    var user = req.user;
    var current = 1;
    var limit = 12;
    var query = req.query;
    var key = "_id";
    var value = -1;
    var src;

    var find = {};
    var  sort = {};
    sort[key] = value;
    var and = '';

    // Order by Query
    if(query.orderby){
        var q = query.orderby.split(' ');
         key = q[0];
         value = Number(q[1]);
        sort = { [key]:   value };
        and = '&orderby=' + key + '+'+ value;
    }
    // Search Query
    if(query.search){
        src =  query.search;
        var help = {'$regex' : src, '$options' : 'i'};
        find.name = help;
    }
    // Page Query
    if(query.page){
        current = query.page;
    }
    var skip = limit * (current-1);
    // Query
    if(query.$gte || query.$lte){
        find.price = query;
        sort = { price:1};
    }
    // Category Query
    if(query.category){
        find.category = query.category;
    }

    // Tag Query
    if(query.tag){
        find.tags = query.tag;
    }
    // Random tags
    itemService.item_random_get(5, function (err, result) {
        result.forEach(function (t) {
            t.tags.forEach(function (xxx) {
                tag.push(xxx);
            });
        });

    });

    // Count pages for Items
    itemService.item_get(find, 0, 0, {}, function (err, result) {
        count = result.length;
        pages = parseInt((count / limit) + 0.9);
    });

    itemService.item_get(find, limit, skip, sort, function (err, result) {
        if (err) {
            res.send(err)
        } else {
            res.render('itemlist', {
                title: 'Proizvodi',
                data: result,
                user: user,
                current: current,
                pages: pages,
                tags: unique(tag.slice(0,6)),
                and: and
            })
        }
    });
};

// Display detail page for Item GET
exports.item_detail = function(req, res) {
    var o_id = new ObjectId(req.params.id);
    var otheritms = [];

    var find ={"_id": o_id};
    var limit = 0;
    var skip = 0;
    var sort = {};

    // 4 Random Items
    itemService.item_random_get(4, function (err, result) {
        otheritms = result;
    });
    // Find Item
    itemService.item_get(find, limit, skip, sort, function (err, result) {
        if (err) {
            res.send(err)
        } else {
            reviewService.review_get({ "itemId": o_id }, function (err, revs) {
                res.render('itemsingle', {
                    title: 'Proizvod',
                    data: result,
                    user: req.user,
                    revs: revs,
                    data2: otheritms
                })
            });
        }
    });
};

// Display Vendor page GET
exports.vendor_detail = function(req, res) {
    var name = req.params.name;
    userService.user_get({"username": name}, function(err, result) {
        if (err) {
            res.send(err)
        } else  {
            itemService.item_get({vendor:name},0,0,{}, function (err, itm) {
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

// Admin panel
// Display Item list GET
exports.item_list_get = function(req, res) {
    var find = {};
    var limit = 0;
    var skip = 0;
    var sort = { _id : -1 };

    itemService.item_get(find, limit, skip, sort, function (err, result) {
        res.render('backend/items', {
            title: 'Add New item',
            data: result,
            user: req.user
        })
    });

};

// Display Item create form GET
exports.item_create_get = function(req, res) {
    res.render('backend/createitem', {
        title: 'Add New item',
        user: req.user
    })
};

// Item create POST
exports.item_create_post = function(req, res) {
    var today = new Date();
    var img = req.files.img;
    var find = { name: req.body.name };
    var limit = 0;
    var skip = 0;
    var sort = { _id : -1 };
    var tag = req.body.tags;

    var item = {
        name: req.body.name,
        price: req.body.price,
        amount: req.body.amount,
        description: req.body.description,
        content_text:req.body.content_text,
        image: img.name,
        //gallery: req.body.gallery,
        category: req.body.category,
        tags: tag.split(","),
        origin: req.body.origin,
        status:req.body.status,
        vendor: req.body.vendor,
        createdOn: today
    };
    itemService.item_get(find, limit, skip, sort, function (err, result) {
        if (err) {
            res.status(500).send('error occured')
        } else {
            if (result === []) {
                res.status(500).send('Item already exists')
            } else {
                img.mv("public/images/items/" + img.name, function (err) {
                    if (err)
                        return res.status(500).send(err);
                });
                itemService.item_post(item, function (err, ress) {
                    res.redirect('/admin')
                })
            }
        }
    });
};

// Item delete POST.
exports.item_delete_post = function(req, res) {
    var o_id = new ObjectId(req.params.id);
    var find = { _id: o_id};
    itemService.item_delete_post(find, function (err, result) {
        res.redirect('/admin')
    });
};

// Display Item update form GET
exports.item_update_get = function(req, res) {
    var o_id = new ObjectId(req.params.id);
    var find = { _id: o_id };
    var limit = 0;
    var skip = 0;
    var sort = { _id : -1 };
    itemService.item_get(find, limit, skip, sort, function (err, result) {
        res.render('backend/updateitem', {
            title: 'Add New item',
            data: result,
            user: req.user
        })
    });
};

// Item update POST
exports.item_update_post = function(req, res) {
    var o_id = new ObjectId(req.body.id);
    var img = { name: req.body.image} ;
    var tag = req.body.tags.split(",");
    if(req.files !== null){
        img = req.files.img;
        img.mv("public/images/items/" + img.name, function (err) {
            if (err)
                return res.status(500).send(err);
        });
    }
    var find = { _id: o_id};
    var set = {
        name: req.body.name,
        price: req.body.price,
        amount: req.body.amount,
        description: req.body.description,
        content_text:req.body.content_text,
        image: img.name,
        // gallery: req.body.gallery,
        category: req.body.category,
        tags: tag,
        origin: req.body.origin,
        status:req.body.status
    };

    itemService.item_update_post(find, set, function (err, result) {
        res.redirect('/admin');
    });

};