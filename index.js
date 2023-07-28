const express = require('express');
const cors = require('cors')
require('./database/db');

const User = require('./user.model');
const { assignGroups, randomizeUsers } = require('./helper');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    res.send("Hello there, Roy")
});

app.post('/add', async (req, res) => {
    const body = req.body;

    const {
        name,
        code,
        comingFrom,
    } = body;

    if((!name || name.length === 0) || (!code || name.code === 0)) {
        return res.status(400).json({
            error: true,
            message: 'Input Name and Code'
        })
    }

    const isUser = await User.findOne({code});

    if(isUser) {
        return res.status(400).json({
            error: true,
            message: 'Code chosen, please choose another!'
        })
    }

    await new User({
        name,
        code,
        comingFrom,
        group: null
    }).save();

    res.json({
        message: 'Successfully added'
    })
})

app.get('/assign', async (req, res) => {

    const code = req.query.code;

    if(code) {
        //to assign one
        const user = await User.findOne({code});
        user.group = req.query.group;

        await user.save();
    }
    else {
        // assign all
        // const assignedUsers = await User.findOne({group: { $ne: null }})

        // if(assignedUsers) {
        //     return res.status(400).json({
        //         error: true,
        //         message: 'Groups Already chosen'
        //     })
        // }

        const users = await User.find({});

        const updatedUsers = assignGroups(users);

        await User.deleteMany({});
        await User.insertMany(updatedUsers)

    }
    return res.json({
        message: 'Users randomly assigned',
    })

})

app.get('/check-group', async (req, res) => {
    const code = req.query.code;

    const user = await User.findOne({code}).lean();

    if(!user) {
        return res.status(400).json({
            error: true,
            message: 'No user with this code'
        })
    }

    let otherUser;

    if(user.isFake) {
        otherUser = await User.findOne({ isFake: true, fakeGroup: user.fakeGroup, code: { $ne: user.code } }).lean();
    }

    return res.json({
        data: {
            ...user,
            otherUser: otherUser?.name
        }
    })
})

app.get('/randomize', async (req, res) => {
    const n = req.query.n ?? 1;

    const finalUsers = []
    for (let index = 1; index < 9; index++) {
        const users = await User.find({group: index}).lean()
        finalUsers.push(randomizeUsers(users, n))
    }

    const money = [100, 200, 200, 100, 300, 100, 500, 400, 100, 200, 300, 400, 300, 200, 400, 100, 500, 300, 300, 200, 200, 100, 200, 300, 400, 300, 200, 200 ];

    const x = Math.floor(Math.random() * money.length)

    return res.json({
        message: 'Successful',
        data: {
            users: finalUsers,
            amount: money[x]
        },
    })
});

app.listen(port, () => {
    console.log('Server Running')
});