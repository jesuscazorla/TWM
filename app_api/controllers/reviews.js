const mongoose = require("mongoose");
const Loc = mongoose.model("Location");


const reviewsCreate = async function (req, res) {
    try {
        const locationid = req.params.locationid;
        const location = await Loc.findById(locationid).select("name reviews");
        if (!location) {
            return res.status(404).json({ message: "Location not found" });
        }
        const { reviewText, author, rating } = req.body;

        location.reviews.push({
            _id: new mongoose.Types.ObjectId(),
            reviewText,
            author,
            rating,
        });
        await location.save();
        const review = location.reviews[location.reviews.length - 1];
        
        await updateAverageRating(location);
        return res.redirect(`/location/${locationid}`);


    }catch(err){
        console.error(err);
        return res.status(400).json({message: "Error creating review", error: err});
    }   
}

const reviewsReadOne = async function (req, res) {
    try{
        const locationid = req.params.locationid;
        const location = await Loc.findById(locationid).select("name reviews");
        if (!location){
            return res.status(404).json({ message: "Location not found"});
        }
            const review = location.reviews.id(req.params.reviewid);
            if(!review){
                return res.status(404).json({ message: "Review not found"});
            }
            return res.status(200).json(review);
        
        }
        catch(err){
            return res.status(500).json(err);
        }}

const reviewsUpdateOne = async function (req, res) {
   try{
     const locationid = req.params.locationid;
     const location = await Loc.findById(locationid).select("name reviews");
        if (!location){
            return res.status(404).json({ message: "Location not found"});
        }
            const review = location.reviews.id(req.params.reviewid);
            if(!review){
                return res.status(404).json({ message: "Review not found"});
            }
            review.reviewText = req.body.reviewText;
            review.author = req.body.author;
            review.rating = req.body.rating;
            await location.save();
            await updateAverageRating(locationid);
            return res.status(200).json(review);
        
        }catch(err){
            return res.status(500).json(err);
        }

   }

const reviewsDeleteOne = async function (req, res) {
    try{
        const locationid = req.params.locationid;
        const location = await Loc.findById(locationid).select("name reviews");
        if (!location){
            return res.status(404).json({ message: "Location not found"});
        }
            const review = location.reviews.id(req.params.reviewid);
            if(!review){
                return res.status(404).json({ message: "Review not found"});
            }
            review.remove();
            await location.save();
            await updateAverageRating(locationid);
            return res.status(204).json(null);
    }catch(err){
        return res.status(500).json(err);
    }
}


module.exports = {
    reviewsCreate,
    reviewsReadOne,
    reviewsUpdateOne,
    reviewsDeleteOne
};