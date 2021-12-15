const fs = require('fs');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
// const { clientId, guildId, token } = require('./config.json');

const dotenv = require('dotenv');

dotenv.config();

const commands = []
const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));

// for (const file of commandFiles) {
//     const command = require(`./commands/${file}`);
//     commands.push(command.data.toJSON());
// }

// registerCommands;

var registerCommands = function registerCommands() {
    for (const file of commandFiles) {
        const command = require(`./commands/${file}`);
        commands.push(command.data.toJSON());
    }
    const help = require("./help.js");
    commands.push(help.data.toJSON());

    console.log(commands);

    const rest = new REST({ version: '9' }).setToken(process.env.token);

    rest.put(Routes.applicationGuildCommands(process.env.clientId, process.env.guildId), { body: commands })
        .then(() => console.log('Successfully registered application commands.'))
        .catch(console.error);

}

module.exports.registerCommands = registerCommands;