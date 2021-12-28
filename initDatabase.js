const Sequelize = require('sequelize');
const { Collection } = require(`discord.js`);
const commands = require("./initCommands.js");
const { time } = require('@discordjs/builders');
// const { REST } = require('@discordjs/rest');
// const { Routes } = require('discord-api-types/v9');

// const rest = new REST().setToken(process.env.token);

const sequelize = new Sequelize('database', 'user', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    storage: 'database.sqlite',
});

const User = require("./models/users.js")(sequelize, Sequelize.DataTypes);
const Group = require("./models/groups.js")(sequelize, Sequelize.DataTypes);
const Time = require("./models/times.js")(sequelize, Sequelize.DataTypes);

async function runSequelize() {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
    const promiseGroup = Group.sync().then(async function() {
        const groups = await Group.findAll();
        client.databases.groups = new Collection();
        for (const group of groups) {
            if (group.players == null) await group.destroy();
            console.log(group.players.split(`;`));
            const players = (group.players.split(`;`)[0] == ``) ? [] : group.players.split(`;`);
            console.log(players);
            client.databases.groups.set(group.name, { name: group.name, players: players });
        }
    });
    const promiseUser = User.sync().then(async function() {
        const users = await User.findAll();
        client.databases.users = new Collection();
        for (const user of users) {
            if (!user.userID || !user.userName) await user.destroy();
            client.databases.users.set(user.userID, { userID: user.userID, userName: user.userName, userXP: user.userXP });
        }
    });
    const promiseTime = Time.sync().then(async function() {
        const times = await Time.findAll();
        client.databases.times = new Collection();
        console.log(client.databases)
        for (const time of times) {
            if (time.players == null) await time.destroy();
            client.databases.times.set(time.name, { name: time.name, startTime: time.startTime, endTime: time.endTime });
        }
    });
    Promise.all([promiseGroup, promiseUser, promiseTime]).then(async function() {
        await commands.registerCommands();
        // console.log(client);
    });
}

async function updateUser(client, target) {
    User.upsert(client.databases.users.get(target.id));
}

async function updateGroup(group) {
    Group.upsert(client.databases.groups.get(group));
}

module.exports = { runSequelize, updateUser, updateGroup, User, Group, Time }

// module.exports = { users };