const express = require("express");
const router = express.Router();
const { User, Organization } = require("../database/database");

router.get("/", (req, res) => {
    res.send("API is working");
});
router.post("/api/organization", async (req, res) => {
    try {
        const { name, logo, title, message } = req.body;
        console.log(req.body);
        const orga = new Organization({ name, logo, title, message });
        await orga.save();
        res.send("Organization created");
    } catch (err) {
        res.status(500).send(err);
    }
});

router.get("/api/organization", async (req, res) => {
    try {
        const { name } = req.body;
        const orga = await Organization.findOne({ name });
        res.json(orga);
    } catch (err) {
        res.status(500).send(err);
    }
});

router.post("/api/addtextuser", async (req, res) => {
    try {
      const { name, email, photo, text, star, organizationName, favorite } = req.body;
  
      const newUser = new User({
        name,
        email,
        photo,
        text, 
        star,
        organizationName,
        favorite
      });
  
      await newUser.save();
      res.status(201).json(newUser); 
    } catch (err) {
      res.status(500).send(err);
    }
  });
  
  router.post("/api/addvideouser", async (req, res) => {
    try {
      const { name, email, photo, video, star, organizationName, favorite } = req.body;
  
      const newUser = new User({
        name,
        email,
        photo,
        video, 
        star,
        organizationName,
        favorite
      });
  
      await newUser.save();
      res.status(201).json(newUser); 
    } catch (err) {
      res.status(500).send(err);
    }
  });
  

router.get("/api/alluser", async (req, res) => {
    try {
        const { organizationName } = req.body;
        const users = await User.find({ organizationName });
        res.json(users);
    } catch (err) {
        res.status(500).send(err);
    }
});

router.get("/api/textuser", async (req, res) => {
    try {
        const { organizationName } = req.body;
        const users = await User.find({ organizationName, text: { $exists: true } });
        res.json(users);
    } catch (err) {
        res.status(500).send(err);
    }
});

router.get("/api/videouser", async (req, res) => {
    try {
        const { organizationName } = req.body;
        const users = await User.find({ organizationName, video: { $exists: true } });
        res.json(users);
    } catch (err) {
        res.status(500).send(err);
    }
});

router.get("/api/favorite", async (req, res) => {
    try {
        const { organizationName } = req.body;
        const users = await User.find({ organizationName, favorite: true });
        res.json(users);
    } catch (err) {
        res.status(500).send(err);
    }
});

router.post("/api/favorite", async (req, res) => {
    try {
        const { email , organizationName } = req.body;
        const user = await User.findOneAndUpdate(
            { email, organizationName },
            { favorite: true },
            { new: true }
        );
        res.json(user);
    } catch (err) {
        res.status(500).send(err);
    }
});

module.exports = router;