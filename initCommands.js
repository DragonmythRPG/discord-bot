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
    client.appCommands = new Collection();
    const commands = [];
    // console.log(`Starting Sections`);
    for (const file of commandFiles) {
        // console.log(file);
        const command = require(`./commands/${file}`);
        client.commands.set(command.data.name, command);
        // console.log(`Creation`);
        // const appCommand = await client.application.commands.create({
        //     name: command.data.name,
        //     description: command.data.description,
        // }, process.env.guildId);
        // console.log(`Collection`);
        // console.log(appCommand.name)
        // await client.appCommands.set(appCommand.id, appCommand);
        // console.log(`Pushing`);
        commands.push(command.data.toJSON());
    }
    // console.log(client.appCommands);
    // console.log(`Starting Help`);
    const help = require("./help.js");
    client.commands.set(help.data.name, help);
    commands.push(help.data.toJSON());
    // console.log(`Ending Help`);


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

    const appComs = await client.application.commands.fetch()
    console.log(`APPCOMS`);
    console.log(appComs);
    for (const appCom of appComs) {
        console.log(`GETTING APPCOM`);
        console.log(appCom);
        client.appCommands.set(appCom.name, appCom);
    }
}

module.exports = { registerCommands, appCommands };