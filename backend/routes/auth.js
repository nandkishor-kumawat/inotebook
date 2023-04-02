const express = require('express');
const User = require('../models/User');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = "Iamalwaysright@"


//POST: /api/auth/createuser
router.post('/createuser', [
    body('name', 'Enter a valid name').isLength({ min: 3 }),
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password must be atleat 5 char').isLength({ min: 5 }),
], async (req, res) => {

    //handle errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    //check email exits or not 
    try {
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).json({ error: "Email already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.password, salt);

        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: secPass
        })

        const data = {
            user:{
                id:user.id
            }
        }

        const authToken = jwt.sign(data, JWT_SECRET);
        // console.log(authToken);
        res.json({authToken});

    } catch (error) {
        console.log({ error: error.message });
        res.status(500).send("Some error occured")
    }
})

module.exports = router
