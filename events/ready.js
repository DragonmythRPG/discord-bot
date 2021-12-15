const debug = true;
const fs = require('fs');
const { Collection } = require('discord.js');
const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));
const userDatabase = require("../initDatabase.js");

module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        if (debug) {
            // const help = require("./help.js");
            // let opt;
            // help.data.addStringOption(option => {
            //     option
            //         .setName("command")
            //         .setDescription("The command you need help with.");
            //     opt = option;
            //     return option;
            // })
            // for (const file of commandFiles) {
            //     const command = require(`../commands/${file}`);
            //     opt.addChoice(command.data.name, command.data.description);
            // }
            const deploy = require("../deploy-commands.js");
            deploy.registerCommands();

            /* Creating and initiating the databases. */

            client.databases = {
                experience: new Collection(),
            };
            // Reflect.defineProperty(client.databases.experience, 'getBalance', {
            //     value: function getBalance(id) {
            //         const user = client.databases.experience.get(id);
            //         return user ? user.balance : 0;
            //     },
            // });
            await userDatabase.runSequelize(client);
        }
        console.log(`Ready! Logged in as ${client.user.tag}`);
        console.log(client);
    },
};