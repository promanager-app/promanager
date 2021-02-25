const express = require("express");
const router = express.Router();
const passport = require("passport");

const Project = require("../../models/Project");

const Room = require('../../models/Room')

var nodemailer = require('nodemailer');
// @route GET api/projects
// @desc Get all projects for a specific user
// @access Private
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    let projectsArr = [];

    // Member projects
    await Project.find({})
      .then(projects => {
        projects.map(project => {
          project.teamMembers &&
            project.teamMembers.map(member => {
              if (member.email == req.user.email) {
                projectsArr.push(project);
              }
            });
        });
      })
      .catch(err => console.log(err));

    const OWNER = {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email
    };

    // Combine with owner projects
    await Project.find({ owner: OWNER })
      .then(projects => {
        let finalArr = [...projects, ...projectsArr];
        res.json(finalArr);
      })
      .catch(err => console.log(err));
  }
);

// @route GET api/projects/:id
// @desc Get specific project by id
// @access Private
router.get(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    let id = req.params.id;

    Project.findById(id).then(project => res.json(project));
  }
);

// @route POST api/projects/create
// @desc Create a new project
// @access Private
router.post(
  "/create",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const OWNER = {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email
    };

    const NEW_PROJECT = await new Project({
      owner: OWNER,
      name: req.body.projectName,
      teamMembers: req.body.members
    });

    NEW_PROJECT.save().then(project => res.json(project));

    const room = new Room({
      room: req.body.projectName,
    })

    room.save()

    var recipient = [];

    req.body.members.forEach(team => {
      recipient.push(team.email);
    });

    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'collaborate.teams@gmail.com',
        pass: 'collabteams1299'
      }
    });

    var mailOptions = {
      from: 'collaboratee.team@gmail.com',
      to: recipient,
      subject: 'You are invited!',
      text: 'that was easy.. @collaborate-sanket'
    };

    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  }
);

// @route PATCH api/projects/update
// @desc Update an existing project
// @access Private
router.patch(
  "/update",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    let projectFields = {};

    projectFields.name = req.body.projectName;
    projectFields.teamMembers = req.body.members;

    Project.findOneAndUpdate(
      { _id: req.body.id },
      { $set: projectFields },
      { new: true }
    )
      .then(project => {
        res.json(project);
      })
      .catch(err => console.log(err));
  }
);

// @route DELETE api/projects/delete/:id
// @desc Delete an existing project
// @access Private
router.delete(
  "/delete/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Project.findById(req.params.id).then(project => {
      project.remove().then(() => res.json({ success: true }));
    });
  }
);

module.exports = router;
