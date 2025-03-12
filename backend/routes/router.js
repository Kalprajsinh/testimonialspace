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
        const { admin } = req.body;
        const organizations = await Organization.find({ admin });
        res.json(organizations);
    } catch (err) {
        res.status(500).send(err);
    }
});

router.get("/api/organization", async (req, res) => {
    try {
        const { admin,name } = req.body;
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
  

router.get("/api/alluser", async (req, res) => {
    try {
        const { admin, organizationName } = req.body;
        const users = await User.find({ admin, organizationName });
        res.json(users);
    } catch (err) {
        res.status(500).send(err);
    }
});

router.get("/api/textuser", async (req, res) => {
    try {
        const { admin, organizationName } = req.body;
        const users = await User.find({ admin, organizationName, text: { $exists: true } });
        res.json(users);
    } catch (err) {
        res.status(500).send(err);
    }
});

router.get("/api/videouser", async (req, res) => {
    try {
        const { admin, organizationName } = req.body;
        const users = await User.find({ admin, organizationName, video: { $exists: true } });
        res.json(users);
    } catch (err) {
        res.status(500).send(err);
    }
});

router.get("/api/favorite", async (req, res) => {
    try {
        const { admin, organizationName } = req.body;
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

module.exports = router;