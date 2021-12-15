const Sequelize = require('sequelize');
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

async function runSequelize(client) {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
    User.sync({ force: true }).then(async function() {
        // createMembers(client).then(async function() {
        //     const users = await User.findAll();
        //     console.log(JSON.stringify(users, null, 2));
        //     users.forEach(user => {
        //         client.databases.experience.set(user.userID, user);
        //     });
        // })


        async function createMembers(client) {
            const guilds = await client.guilds.fetch();
            for (let guild of guilds.values()) {
                guild = await guild.fetch(guild.id);
                const members = await guild.members.fetch();
                for (const member of members.values()) {
                    User.create({ userID: member.user.id, userName: member.user.username, userXP: 0 });
                }
            }
        }
    });
}

async function updateDatabase(client, target) {
    User.upsert(client.databases.experience.get(target.id));
    // client.databases.experience.each((value) => {
    //     User.upsert({ userID: value.userID, userName: value.userName, userXP: value.userXP })
    // })
    const users = await User.findAll();
    console.log(JSON.stringify(users, null, 2));
}

module.exports = { runSequelize, updateDatabase }

// module.exports = { users };