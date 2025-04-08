const express = require("express");
const router = express.Router();
const { User, Organization } = require("../database/database");
const { Organizationdata, userdatatext, userdatavideo } = require("../zod/zod");

router.get("/", (req, res) => {
    res.send(".");
});

router.post("/api/organization", async (req, res) => {
    try {
        const { admin, name, logo, title, message } = req.body;

        const data = Organizationdata.safeParse(req.body);
        if (!data.success) {
            return res.status(400).send(data.error.issues);
        }

        const existingOrganization = await Organization.findOne({ admin,name });
        if (existingOrganization) {
            return res.status(400).send("Organization already exists");
        }

        const orga = new Organization({ admin, name, logo, title, message });
        await orga.save();
        res.status(200).send("Organization created");
    } catch (err) {
        res.status(500).send(err);
    }
});

router.get("/api/admin-organization", async (req, res) => {
    try {
        const { admin } = req.query;
        const organizations = await Organization.find({ admin });
        res.json(organizations);
    } catch (err) {
        res.status(500).send(err);
    }
});

router.get("/api/organization", async (req, res) => {
    try {
        const { admin,name } = req.query;
        const orga = await Organization.findOne({ admin,name });
        res.json(orga);
    } catch (err) {
        res.status(500).send(err);
    }
});

router.post("/api/addtextuser", async (req, res) => {
    try {
      const { admin, name, email, photo, text, star, organizationName, favorite } = req.body;

      const data = userdatatext.safeParse(req.body);
      if (!data.success) {
          return res.status(400).send(data.error.issues);
       }

       const orga = await Organization.findOne({ admin, name: organizationName });
       if (!orga) {
            return res.status(404).send("Organization not found");
        }

        const existingUser = await User.findOne({ admin, email, organizationName });
        if (existingUser) {
            return res.status(400).send("User with this email already exists in the organization");
        }

      const newUser = new User({
        admin,
        name,
        email,
        photo,
        text, 
        star,
        organizationName,
        favorite
      });

      await newUser.save();
      res.status(200).json(newUser); 
    } catch (err) {
      res.status(500).send(err);
    }
  });
  
  router.post("/api/addvideouser", async (req, res) => {
    try {
      const { admin, name, email, photo, video, star, organizationName, favorite } = req.body;

      const data = userdatavideo.safeParse(req.body);
      if (!data.success) {
          return res.status(400).send(data.error.issues);
       }

       const orga = await Organization.findOne({ admin, name: organizationName });
       if (!orga) {
          return res.status(404).send("Organization not found");
       }

       const existingUser = await User.findOne({ admin, email, organizationName });
       if (existingUser) {
           return res.status(400).send("User with this email already exists in the organization");
       }
       
      const newUser = new User({
        admin,
        name,
        email,
        photo,
        video, 
        star,
        organizationName,
        favorite
      });
  
      await newUser.save();
      res.status(200).json(newUser); 
    } catch (err) {
      res.status(500).send(err);
    }
  });
  
////////////////////////////////////////////////

router.get("/api/alluser", async (req, res) => {
    try {
        const { admin, organizationName } = req.query;
        const users = await User.find({ admin, organizationName });
        res.json(users);
    } catch (err) {
        res.status(500).send(err);
    }
});

router.get("/api/textuser", async (req, res) => {
    try {
        const { admin, organizationName } = req.query;
        const users = await User.find({ admin, organizationName, text: { $exists: true } });
        res.json(users);
    } catch (err) {
        res.status(500).send(err);
    }
});

router.get("/api/videouser", async (req, res) => {
    try {
        const { admin, organizationName } = req.query;
        const users = await User.find({ admin, organizationName, video: { $exists: true } });
        res.json(users);
    } catch (err) {
        res.status(500).send(err);
    }
});

router.get("/api/favorite", async (req, res) => {
    try {
        const { admin, organizationName } = req.query;
        const users = await User.find({ admin, organizationName, favorite: true });
        res.json(users);
    } catch (err) {
        res.status(500).send(err);
    }
});

router.post("/api/favorite", async (req, res) => {
    try {
        const { admin, email , organizationName } = req.body;
        const user = await User.findOneAndUpdate(
            { admin, email, organizationName },
            { favorite: true },
            { new: true }
        );
        res.json(user);
    } catch (err) {
        res.status(500).send(err);
    }
});

router.post("/api/favorite/remove", async (req, res) => {
    try {
        const { admin, email , organizationName } = req.body;
        const user = await User.findOneAndUpdate(
            { admin, email, organizationName },
            { favorite: false },
            { new: true }
        );
        res.json(user);
    } catch (err) {
        res.status(500).send(err);
    }
});

router.post("/api/delete/testimonial", async (req, res) => {
    try {
        const { admin, email, organizationName } = req.body;

        // Find and delete the user testimonial
        const deletedUser = await User.findOneAndDelete({ admin, email, organizationName });

        if (!deletedUser) {
            return res.status(404).send("Testimonial not found");
        }

        res.status(200).send("Testimonial deleted successfully");
    } catch (err) {
        res.status(500).send(err);
    }
});


/////////////////////////////////////////////////////

router.get("/api/admin-Testimonials", async (req, res) => {
    try {
        const { admin } = req.query;
        const organizations = await User.find({ admin });
        res.json(organizations.length);
    } catch (err) {
        res.status(500).send(err);
    }
});

router.get("/api/avgrating", async (req, res) => {
    try {
        const { admin } = req.query;
        const organizations = await User.find({ admin });
        var sum = 0;
        for (var i = 0; i < organizations.length; i++) {
            sum += organizations[i].star;
        }
        var avg = sum / organizations.length;
        res.json(avg);
    } catch (err) {
        res.status(500).send(err);
    }
});

router.get("/api/testimonial-types", async (req, res) => {
    try {
        const { admin } = req.query;
        const textCount = await User.countDocuments({ admin, text: { $exists: true } });
        const videoCount = await User.countDocuments({ admin, video: { $exists: true } });
        const totalCount = textCount + videoCount;
        const textPercentage = ((textCount / totalCount) * 100).toFixed(2);
        const videoPercentage = ((videoCount / totalCount) * 100).toFixed(2);
        res.json({ textPercentage, videoPercentage });
    } catch (err) {
        res.status(500).send(err);
    }
});

router.get("/api/rating-distribution", async (req, res) => {
    try {
        const { admin } = req.query;
        const ratings = await User.aggregate([
            { $match: { admin } },
            { $group: { _id: "$star", count: { $sum: 1 } } },
            { $sort: { _id: -1 } }
        ]);
        const totalRatings = ratings.reduce((acc, rating) => acc + rating.count, 0);
        const ratingDistribution = ratings.map(rating => ({
            star: rating._id,
            percentage: ((rating.count / totalRatings) * 100).toFixed(2)
        }));
        res.json(ratingDistribution);
    } catch (err) {
        res.status(500).send(err);
    }
});

router.get("/api/last5testimonials", async (req, res) => {
    try {
        const { admin } = req.query;
        const testimonials = await User.find({ admin,text: { $exists: true } }).sort({ _id: -1 }).limit(5);
        res.json(testimonials);
    } catch (err) {
        res.status(500).send(err);
    }
});

////////////////////////////////////////////////////

router.get("/api/organization-Testimonials", async (req, res) => {
    try {
        const { admin,organizationName } = req.query;
        const organizations = await User.find({ admin,organizationName });
        res.json(organizations.length);
    } catch (err) {
        res.status(500).send(err);
    }
});

router.get("/api/organization-avgrating", async (req, res) => {
    try {
        const { admin,organizationName } = req.query;
        const organizations = await User.find({ admin, organizationName});
        var sum = 0;
        for (var i = 0; i < organizations.length; i++) {
            sum += organizations[i].star;
        }
        var avg = sum / organizations.length;
        res.json(avg);
    } catch (err) {
        res.status(500).send(err);
    }
});

router.get("/api/orga-testimonial-types", async (req, res) => {
    try {
        const { admin,organizationName } = req.query;
        const textCount = await User.countDocuments({ admin, organizationName, text: { $exists: true } });
        const videoCount = await User.countDocuments({ admin, organizationName, video: { $exists: true } });
        const totalCount = textCount + videoCount;
        const textPercentage = ((textCount / totalCount) * 100).toFixed(2);
        const videoPercentage = ((videoCount / totalCount) * 100).toFixed(2);
        res.json({ textPercentage, videoPercentage });
    } catch (err) {
        res.status(500).send(err);
    }
});

router.get("/api/orga-rating-distribution", async (req, res) => {
    try {
        const { admin,organizationName } = req.query;
        const ratings = await User.aggregate([
            { $match: { admin,organizationName } },
            { $group: { _id: "$star", count: { $sum: 1 } } },
            { $sort: { _id: -1 } }
        ]);
        const totalRatings = ratings.reduce((acc, rating) => acc + rating.count, 0);
        const ratingDistribution = ratings.map(rating => ({
            star: rating._id,
            percentage: ((rating.count / totalRatings) * 100).toFixed(2)
        }));
        res.json(ratingDistribution);
    } catch (err) {
        res.status(500).send(err);
    }
});

module.exports = router;