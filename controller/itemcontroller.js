var ObjectId = require('mongodb').ObjectId;
var Item = require('../db/item');
var User = require('../db/User');
var Review = require('../db/reviewModel');
var unique = require('array-unique');

// Front
// List of all Items
exports.item_list = function(req, res) {
    var cat = req.params.cat;
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
        sort[key] = value;
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
    if(cat){
        find.category = cat;
    }
    // Tag Query
    if(t){
        find.tags = t;
    }
    Item.find({  },{ tags: 1, _id: 0 }, function (err, result) {
        result.forEach(function (t) {
            t.tags.forEach(function (xxx) {
                tag.push(xxx);
            });
        });
    });
    // Count pages for Items
    Item.find(find, function(err, result) {
        count = result.length;
        pages = parseInt((count / limit) + 0.9);
    });

    // Find Items
    Item.find( find , function(err, result) {
        if (err) {
            res.send(err)
        } else {
                res.render('itemlist', {
                    title: 'items List',
                    data: result,
                    user: user,
                    current: current,
                    pages: pages,
                    tags: unique(tag.slice(0,6)),
                    and: and
                })
            }
    }).limit(limit).skip(skip).sort( sort )
};

// Display detail page for Item
exports.item_detail = function(req, res) {
    var o_id = new ObjectId(req.params.id);
    var otheritms = [];

    // 4 Random Items
    Item.aggregate([{$sample: {size: 4}}], function (err, ress) {
        otheritms = ress;
    });
    // Find Item
    Item.find({"_id": o_id}, function(err, result) {
        if (err) {
            res.send(err)
        } else {
            Review.find({ "itemId": o_id }, function (err, revs) {
                var img = "";

                revs.forEach(function (r) {
                    User.find({ username: r.username }, function (err, user) {
                       img = user[0].image;


                    });
                    r.image = "jjj";


                });

                console.log(revs);





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

// Display Vendor page
exports.vendor_detail = function(req, res) {
    var name = req.params.name;
    User.find({"username": name}, function(err, result) {
        if (err) {
            res.send(err)
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

// Admin panel
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
    var img = { name: req.body.image} ;

    var tag = req.body.tags.split(",");

    if(req.files !== null){
        img = req.files.img;
        img.mv("public/images/items/" + img.name, function (err) {
            if (err)
                return res.status(500).send(err);
        });
    }

    var data = {
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



    req.db.collection('items').update({ "_id": o_id  }, { $set : data },{multi: true, upsert: true });
    res.redirect('/admin');

};



