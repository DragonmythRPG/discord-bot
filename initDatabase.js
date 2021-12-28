const Sequelize = require('sequelize');
const { Collection } = require(`discord.js`);
const commands = require("./initCommands.js");
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

async function runSequelize() {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
    Group.sync().then(async function() {
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
    User.sync().then(async function() {
        const users = await User.findAll();
        client.databases.users = new Collection();
        for (const user of users) {
            if (!user.userID || !user.userName) await user.destroy();
            client.databases.users.set(user.userID, { userID: user.userID, userName: user.userName, userXP: user.userXP });
        }
    }).then(async function() {
        await commands.registerCommands();
        // console.log(client);
    });
    // console.log(client);
    // User.sync({ alter: true }).then(async function() {
    //     // createMembers(client).then(async function() {
    //     //     const users = await User.findAll();
    //     //     console.log(JSON.stringify(users, null, 2));
    //     //     users.forEach(user => {
    //     //         client.databases.experience.set(user.userID, user);
    //     //     });
    //     // })


    //     async function createMembers(client) {
    //         const guilds = await client.guilds.fetch();
    //         for (let guild of guilds.values()) {
    //             guild = await guild.fetch(guild.id);
    //             const members = await guild.members.fetch();
    //             for (const member of members.values()) {
    //                 User.create({ userID: member.user.id, userName: member.user.username, userXP: 0 });
    //             }
    //         }
    //     }
    // });
}

async function updateUser(client, target) {
    User.upsert(client.databases.users.get(target.id));
}

async function updateGroup(group) {
    Group.upsert(client.databases.groups.get(group));
}

module.exports = { runSequelize, updateUser, updateGroup, User, Group }

// module.exports = { users };