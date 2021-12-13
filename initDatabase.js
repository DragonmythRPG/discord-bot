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

const users = require("./models/users.js")(sequelize, Sequelize.DataTypes);

var runSequelize = async function runSequelize(client) {
    // sequelize.sync().then(async() => {
    //     const userList = []
    // });
    await sequelize.sync();
    const guilds = await client.guilds.fetch();
    guilds.forEach(async function(guild) {
        guild = await guild.fetch(guild.id);
        const members = await guild.members.fetch();
        members.forEach(async function(member) {
            console.log(member);
        });
    });
}

// console.log(users);

module.exports.runSequelize = runSequelize;

// module.exports = { users };