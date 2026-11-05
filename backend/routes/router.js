const express = require("express");
const router = express.Router();
const { User, Organization, Subscription } = require("../database/database");
const { Organizationdata, userdatatext, userdatavideo } = require("../zod/zod");

// Helper to look up subscription for an admin (by email, fullname, or userId)
const getAdminSubscription = async (adminIdentifier) => {
  if (!adminIdentifier) return null;
  return await Subscription.findOne({
    $or: [
      { email: adminIdentifier },
      { fullname: adminIdentifier },
      { userId: adminIdentifier }
    ]
  });
};

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

        // Plan restrictions on Organization creation:
        // Free: max 1
        // Standard: max 3
        // Pro: unlimited
        const subscription = await getAdminSubscription(admin);
        const plan = subscription ? subscription.plan : 'Free';
        const orgCount = await Organization.countDocuments({ admin });

        if (plan === 'Free' && orgCount >= 1) {
            return res.status(403).json({ 
                error: "Free plan is limited to 1 organization. Please upgrade your plan to create more." 
            });
        }
        if (plan === 'standard' && orgCount >= 3) {
            return res.status(403).json({ 
                error: "Standard plan is limited to 3 organizations. Please upgrade to Pro for unlimited organizations." 
            });
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

        // Testimonial limit enforcement (Free: 50 testimonials total)
        const subscription = await getAdminSubscription(admin);
        const plan = subscription ? subscription.plan : 'Free';
        if (plan === 'Free') {
            const testimonialCount = await User.countDocuments({ admin });
            if (testimonialCount >= 50) {
                return res.status(403).json({
                    error: "This space has reached the 50 testimonial limit for the Free plan. Please ask the admin to upgrade."
                });
            }
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
       
       // Testimonial limit enforcement (Free: 50 testimonials total)
       const subscription = await getAdminSubscription(admin);
       const plan = subscription ? subscription.plan : 'Free';
       if (plan === 'Free') {
           const testimonialCount = await User.countDocuments({ admin });
           if (testimonialCount >= 50) {
               return res.status(403).json({
                   error: "This space has reached the 50 testimonial limit for the Free plan. Please ask the admin to upgrade."
               });
           }
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

        // Watermark check: Free plan has watermark, Standard & Pro have watermark removed
        const subscription = await getAdminSubscription(admin);
        const plan = subscription ? subscription.plan : 'Free';
        const removeWatermark = (plan === 'standard' || plan === 'pro');

        res.set("Access-Control-Expose-Headers", "X-Remove-Watermark");
        res.set("X-Remove-Watermark", removeWatermark ? "true" : "false");
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
    const { fullname, email, userId } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const safeFullname = fullname || (email ? email.split('@')[0] : "User");
    let subscription = await Subscription.findOne({ email: email });

    if (!subscription) {
      subscription = await Subscription.create({
        userId: userId || email, 
        fullname: safeFullname,
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
    } else {
      // Check if paid subscription has expired
      if (subscription.plan !== 'Free' && subscription.endDate && new Date(subscription.endDate) < new Date()) {
        subscription.plan = 'Free';
        subscription.status = 'inactive';
        subscription.lastUpdated = new Date();
        await subscription.save();
      }
    }
    res.status(200).json(subscription);
  } catch (err) {
    console.error("Error checking/creating subscription:", err);
    res.status(500).json({ error: err.message || "Error checking subscription" });
  }
});

router.post("/api/check-session", async (req, res) => {
  try {
    const { sessionId } = req.body;
    if (!sessionId) {
      return res.status(400).json({ error: "Session ID required" });
    }

    // Check both current session and any past sessions in payment history
    const subscription = await Subscription.findOne({
      $or: [
        { sessionId },
        { "paymentHistory.sessionId": sessionId }
      ]
    });

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
      currency = "usd", 
      sessionId, 
      status = "active", 
      startDate, 
      endDate 
    } = req.body;

    const safeFullname = fullname || (email ? email.split('@')[0] : "User");

    if (!email || !plan || amount === undefined || !sessionId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    let subscription = await Subscription.findOne({ email });

    const newStartDate = startDate ? new Date(startDate) : new Date();
    const newEndDate = endDate ? new Date(endDate) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    if (subscription) {
      subscription.fullname = safeFullname;
      subscription.plan = plan;
      subscription.amount = Number(amount);
      subscription.currency = currency;
      subscription.sessionId = sessionId;
      subscription.status = status;
      subscription.startDate = newStartDate;
      subscription.endDate = newEndDate;
      subscription.lastUpdated = new Date();

      if (!subscription.paymentHistory) {
        subscription.paymentHistory = [];
      }
      subscription.paymentHistory.push({
        amount: Number(amount),
        currency,
        date: new Date(),
        sessionId
      });
    } else {
      subscription = new Subscription({
        userId: userId || email,
        fullname: safeFullname,
        email,
        plan,
        amount: Number(amount),
        currency,
        sessionId,
        status,
        startDate: newStartDate,
        endDate: newEndDate,
        lastUpdated: new Date(),
        paymentHistory: [{
          amount: Number(amount),
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
    res.status(500).json({ error: "Failed to update subscription", details: err.message });
  }
});

module.exports = router;