const express = require('express');
const app = express();
const bcrypt = require('bcrypt');

const PORT = process.env.PORT || 8000;

const users = []; // store users, shoule be in database
app.use(express.json());

// create a new user 
app.post('/users', async (req, res) => {
    try {
        // const salt = await bcrypt.genSaltSync(); // generate salt for password hashing 
        // const hashedPassword = await bcrypt.hash(req.body.password, salt); // hash password with salt 

        //above two lines can be written in one line
        const hashedPassword = await bcrypt.hash(req.body.password, 10); // hash password with salt, 10 is the number of rounds to generate salt 
        const user = {name: req.body.name, password: hashedPassword};
        users.push(user);
        res.sendStatus(201);
    } catch(error) {
        res.sendStatus(500);
    }
})


app.get('/users', (req, res) => {
    res.json(users);
})

// login user 
app.post('/users/login', async (req, res) => {
    const user = users.find(user => user.name === req.body.name);
    if(user == null)  {
        return res.sendStatus(400).send('Cannot find user');    
    }
    try {
        if(await bcrypt.compare(req.body.password, user.password))  {
            res.send('Success');
        } else {
            res.send('Not Allowed');     
        }
    } catch(error) {
        res.sendStatus(500);
    }
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
 })