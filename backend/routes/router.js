const express = require("express");
const router = express.Router();
const { User, Organization, Subscription } = require("../database/database");
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

router.delete("/api/delete-organization", async (req, res) => {
    try {
      const { admin, organizationId } = req.body;
  
      // Find the organization to delete
      const deletedOrganization = await Organization.findOneAndDelete({
        _id: organizationId,
        admin,
      });
  
      if (!deletedOrganization) {
        return res.status(404).send("Organization not found");
      }
  
      // Delete all testimonials (users) associated with the organization
      await User.deleteMany({
        admin,
        organizationName: deletedOrganization.name,
      });
  
      res.status(200).send("Organization and associated testimonials deleted successfully");
    } catch (err) {
      res.status(500).send(err);
    }
  });
  
router.post("/api/check-subscription", async (req, res) => {
  try {
    const { fullname, email } = req.body;

    // Check if user already has a subscription
    console.log("Checking subscription for user:", {
      fullName: fullname,
      email: email
    });
    const subscription = await Subscription.findOne({ email: email});

    // If no subscription exists, create a new one with free plan
    if (!subscription) {
      subscription = await Subscription.create({
        userId: email, // Using email as userId for free plan
        fullname,
        email,
        plan: 'Free',
        amount: 0,
        currency: 'usd',
        sessionId: 'free_' + Date.now(),
        status: 'active',
        startDate: new Date(),
        endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year for free plan
        paymentHistory: []
      });
    }
    console.log("Subscription found:", subscription);
    res.status(200).json(subscription);
  } catch (err) {
    console.error("Error checking/creating subscription:", err);
    res.status(500).send(err);
  }
});

router.post("/api/check-session", async (req, res) => {
  try {
    const { sessionId } = req.body;

    // Check if this session has been used before
    const subscription = await Subscription.findOne({ sessionId });

    res.status(200).json({
      used: !!subscription
    });
  } catch (err) {
    console.error("Error checking session:", err);
    res.status(500).send(err);
  }
});

router.post("/api/update-subscription", async (req, res) => {
  try {
    const { 
      userId, 
      fullname,
      email, 
      plan, 
      amount, 
      currency, 
      sessionId, 
      status, 
      startDate, 
      endDate 
    } = req.body;

    // Validate required fields
    if (!email || !plan || !amount || !sessionId || !fullname) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Find existing subscription
    let subscription = await Subscription.findOne({ email });

    if (subscription) {
      // Update existing subscription
      subscription.fullname = fullname;
      subscription.plan = plan;
      subscription.amount = amount;
      subscription.currency = currency;
      subscription.sessionId = sessionId;
      subscription.status = status;
      subscription.startDate = startDate;
      subscription.endDate = endDate;
      subscription.lastUpdated = new Date();

      // Add to payment history
      subscription.paymentHistory.push({
        amount,
        currency,
        date: new Date(),
        sessionId
      });
    } else {
      // Create new subscription
      subscription = new Subscription({
        userId,
        fullname,
        email,
        plan,
        amount,
        currency,
        sessionId,
        status,
        startDate,
        endDate,
        lastUpdated: new Date(),
        paymentHistory: [{
          amount,
          currency,
          date: new Date(),
          sessionId
        }]
      });
    }

    await subscription.save();

    res.status(200).json({
      message: "Subscription updated successfully",
      subscription
    });

  } catch (err) {
    console.error("Error updating subscription:", err);
    res.status(500).json({ error: "Failed to update subscription" });
  }
});

module.exports = router;