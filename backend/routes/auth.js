const express = require('express');
const User = require('../models/User');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser');

const JWT_SECRET = "Iamalwaysright@";


// ROUTE 1: Create a User using: POST "/api/auth/createuser" .No login required
router.post('/createuser', [
    body('name', 'Enter a valid name').isLength({ min: 3 }),
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password must be atleat 5 char').isLength({ min: 5 })
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
            user: {
                id: user.id
            }
        }

        const authToken = jwt.sign(data, JWT_SECRET);
        // console.log(authToken);
        res.json({ authToken });

    } catch (error) {
        console.log({ error: error.message });
        res.status(500).send("Internal server error");
    }


    // ROUTE 2: Authenticate a User using: POST "/api/auth/login" .No login required
    router.post('/login', [
        body('email', 'Enter a valid email').isEmail(),
        body('password', 'Password cannot be blank').exists()
    ], async (req, res) => {

        //handle errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;

        try {
            let user = await User.findOne({ email });
            if (!user) {
                return res.status(400).json({ error: "please login with correct credentials" });
            }

            const passwordCompare = await bcrypt.compare(password, user.password);

            if (!passwordCompare) {
                return res.status(400).json({ error: "please login with correct credentials" });
            }

            const data = {
                user: {
                    id: user.id
                }
            }

            const authToken = jwt.sign(data, JWT_SECRET);
            res.json({ authToken });


        } catch (error) {
            console.log({ error: error.message });
            res.status(500).send("Internal server error");
        }

    });

    // ROUTE 3: Get loggedin User Details using: POST "/api/auth/getuser" .Login required
    router.post('/getuser', fetchuser, async (req, res) => {

        try {
            const userId = req.user.id;
            const user = await User.findById(userId).select("-password");
            res.send(user);
        } catch (error) {
            console.log({ error: error.message });
            res.status(500).send("Internal server error");
        }
    })

})

module.exports = router
