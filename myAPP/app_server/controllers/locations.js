const homelist = function(req, res, next){
    res.render("index", {title: "Home"});
};

const locationInfo = function(req, res, next){
    res.render("index", {title: "Location Info"});
}

const addReview = function(req, res, next){
    res.render("index", {title: "Add Review"});
}

module.exports = {
    homelist,
    locationInfo,
    addReview
};