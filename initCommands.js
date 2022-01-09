const fs = require('fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
// const { clientId, guildId, token } = require('./config.json');

const dotenv = require('dotenv');
const { Collection } = require('discord.js');

dotenv.config();

const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));

let rest;

let appCommands;

async function registerCommands() {
    const commands = [];
    for (const file of commandFiles) {
        const command = require(`./commands/${file}`);
        client.commands.set(command.data.name, command);
        commands.push(command.data.toJSON());
    }
    const help = require("./help.js");
    client.commands.set(help.data.name, help);
    commands.push(help.data.toJSON());


    rest = new REST({ version: '9' }).setToken(process.env.token);

    await rest.put(Routes.applicationGuildCommands(process.env.clientId, process.env.guildId), { body: commands })
        .then(() => console.log('Successfully registered Guild commands.'))
        .catch(console.error);

    // client.guilds.fetch(process.env.guildId).then(guild => {
    //     guild.commands.fetch().then(com => appCommands = com);
    // });


    // rest.put(Routes.applicationCommands(process.env.clientId), { body: [] })
    //     .then(() => console.log('Successfully registered Application commands.'))
    //     .catch(console.error);

    const appComs = await client.application.commands.fetch(undefined, { guildId: process.env.guildId })
    for (const appCom of appComs) {
        client.appCommands.set(appCom[1].name, appCom[1]);
    }
    console.log(client);
}

module.exports = { registerCommands, appCommands };