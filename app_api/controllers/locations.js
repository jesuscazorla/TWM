
const mongoose = require("mongoose");
const Loc = mongoose.model("Location");

const locationReadAll = async function (req, res) {
    const locations = await Loc.find();
    res.status(200).json(locations);
}

const locationsCreate = async function (req, res) {
    try {
        const location = await Loc.create({
            name: req.body.name,
            address: req.body.address,
            facilities: req.body.facilities,
            rating: 0,
            coords: {
                type: "Point",
                coordinates: [
                    parseFloat(req.body.lng),
                    parseFloat(req.body.lat)
                ]
                },
                openingTimes: req.body.openingTimes,
                reviews: [],
            });

            return res.status(201).json(location);
    } catch (error) {
        console.error(error);
        res.status(400).json({message: "Error creating location", error: error});
    }

    //Otra forma
    /*
    const location = new Loc({
        ...req.body,
        coords: {
            type: "Point",
            coordinates: [
                parseFloat(req.body.lng),
                parseFloat(req.body.lat)
            ]
        }, 
    });*/



}

const locationsReadOne = async function (req, res) {
    try {
        const locationid = req.params.locationid;
        const location = await Loc.findById(locationid);
        if (!location) {
            return res.status(404).json({ message: "Location not found" });
        }
        return res.status(200).json(location);

    }
    catch (err) {
        return res.status(500).json(err);
    }
}

const locationsUpdateOne = async function (req, res) {
    try {
        const locationid = req.params.locationid;
        const location = await Loc.findByIdAndUpdate(locationid, {  
            name: req.body.name,
            address: req.body.address,
            facilities: req.body.facilities,
            coords: {
                type: "Point",
                coordinates: [
                    parseFloat(req.body.lng),
                    parseFloat(req.body.lat)
                ]
            },
            openingTimes: req.body.openingTimes,
        });
        if (!location) {
            return res.status(404).json({ message: "Location not found" });
        }else{
            return res.status(200).json(location);
        }

    } catch (err) {
        return res.status(404).json(err);
    }
}

const locationsDeleteOne =  async function (req, res) {
    try {
        const locationid = req.params.locationid;
        const location = await Loc.findByIdAndDelete(locationid);
        return res.status(204).json(location);
    } catch (err) {
        return res.status(404).json({message:"Location not found", err: err});
    }

}

updateAverageRating = async function (location) {
    const locationid = location._id;
    const reviews = location.reviews;
    const reviewCount = reviews.length;
    const totalRating = reviews.reduce((total, review) => total + review.rating, 0);
    const averageRating = totalRating / reviewCount;

    try{
        await Loc.findByIdAndUpdate(locationid, { 
            rating: averageRating,
        });
    }catch(err){
        console.error(err);

    }
}

module.exports = {
    locationReadAll,
    locationsCreate,
    locationsReadOne,
    locationsUpdateOne,
    locationsDeleteOne,
    updateAverageRating,
}
