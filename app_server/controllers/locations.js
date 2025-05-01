const { request } = require("undici");
const apiOptions = {
  server: "http://localhost:3000",
};

const homelist = async function (req, res, next) {

  const response = await request(apiOptions.server+ "/api/locations", {
    method: "GET",
  });

  if(response.statusCode !== 200) {
    console.error("Error fetching locations");
    return res.status(500).send("Error fetching locations");

  }
 
  const locations = await response.body.json();

  res.render("locations-list", {
    title: "Loc8r - find a place to work with wifi",
    pageHeader: {
      title: "Loc8r",
      strapline: "Find places to work with wifi near you!",
    },
    sidebar: "Looking for wifi and a seat? Loc8r helps you find places to work when out and about. Perhaps with coffee, cake or a pint? Let Loc8r help you find the place you're looking for.",
    locations,
  });

 
}


const locationInfo = async function (req, res, next) {
  const response = await request(apiOptions.server+ "/api/locations/" + req.params.locationid, {
    method: "GET",
  });

  if(response.statusCode !== 200) {
    console.error("Error fetching location");
    return res.status(404).send("No location found");
  }

  const location = await response.body.json();

  res.render("location-info", {
    title: location.name,
    pageHeader: { title: location.name },
    sidebar: {
      context: "is on Loc8r because it has accessible wifi and space to work.",
      callToAction: "If you’ve been and you like it - or if you don’t - please leave a review to help other visitors just like you.",
    },
    location,
  });
};

const addReview = async function (req, res, next) {
    const response = await request(apiOptions.server+ "/api/locations/" + req.params.locationid, {
      method: "GET",
    });
  
    if(response.statusCode !== 200) {
      console.error("Error fetching location");
      return res.status(404).send("No location found");
    }

    const location = await response.body.json();
    res.render("location-review-form", {
      title: location.name,
      pageHeader: { title: "Review " + location.name },
      id: location._id,
    });
};


module.exports = {
  homelist,
  locationInfo,
  addReview,
};
