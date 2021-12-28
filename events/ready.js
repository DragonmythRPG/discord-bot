const { Collection } = require('discord.js');
const userDatabase = require("../initDatabase.js");
// const commands = require("../initCommands.js");
const buttons = require("../initButtons.js");

const debug = true;

module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        if (debug) {
            client.databases = {};
            await userDatabase.runSequelize(client);
            // commands.registerCommands();
            buttons.registerButtons();
        }
        console.log(`Ready! Logged in as ${client.user.tag}`);
        // console.log(client);
    },
};