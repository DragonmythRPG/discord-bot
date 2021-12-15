// import * as fs from "fs";
// import { Client, Collection, Intents, Interaction, MessageEmbed } from "discord.js";
// import * as token from "./config.json";

const dotenv = require('dotenv');

dotenv.config();

// Require the necessary discord.js classes
const fs = require('fs');
const { Sequelize } = require('sequelize');
const { Client, Collection, Intents, Formatters, Interaction, MessageEmbed } = require('discord.js');

// console.log(users);

// Create a new client instance
const client = new Client({
    intents: [
        Intents.FLAGS.DIRECT_MESSAGES,
        Intents.FLAGS.DIRECT_MESSAGE_TYPING,
        Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_BANS,
        Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
        Intents.FLAGS.GUILD_INTEGRATIONS,
        Intents.FLAGS.GUILD_INVITES,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        Intents.FLAGS.GUILD_MESSAGE_TYPING,
        Intents.FLAGS.GUILD_PRESENCES,
        Intents.FLAGS.GUILD_VOICE_STATES,
        Intents.FLAGS.GUILD_WEBHOOKS
    ],
});
client.commands = new Collection();

const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));
for (const file of commandFiles) {
    console.log(`File: ${file}`);
    const command = require(`./commands/${file}`);
    console.log("Command:");
    console.log(command);
    client.commands.set(command.data.name, command);
}
const help = require("./help.js");
client.commands.set(help.data.name, help);

const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
    const event = require(`./events/${file}`);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
}

// Login to Discord with your client's token
client.login(process.env.token);