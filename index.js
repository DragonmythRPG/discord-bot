// import * as fs from "fs";
// import { Client, Collection, Intents, Interaction, MessageEmbed } from "discord.js";
// import * as token from "./config.json";

const dotenv = require('dotenv');

dotenv.config();

// Require the necessary discord.js classes
const fs = require('fs');
const { Sequelize } = require('sequelize');
const { Client, Collection, Intents, Formatters, Interaction, MessageEmbed } = require('discord.js');
const debug = true;

const userDatabase = require("./initDatabase.js");
const xp = new Collection();

// console.log(users);

// Create a new client instance
const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    ],
});
client.commands = new Collection();

const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.data.name, command);
}

const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
    const event = require(`./events/${file}`);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
}

// When the client is ready, run this code (only once)
client.once('ready', () => {
    if (debug) {
        const help = require("./commands/help.js")
        let opt;
        help.data.addStringOption(option => {
            option
                .setName("command")
                .setDescription("The command you need help with.");
            opt = option;
            return option;
        })
        for (const file of commandFiles) {
            const command = require(`./commands/${file}`);
            opt.addChoice(command.data.name, command.data.description);
        }
        const deploy = require("./deploy-commands");
        deploy.registerCommands();
    }
    userDatabase.runSequelize(client);
    // const storedXP = users.findAll()
    //     .then(obj => {
    //         console.log(obj)
    //         obj.forEach(x => xp.set(x.user_id, x));
    //         console.log(obj)
    //     });
    console.log(xp);
    console.log('Ready!');
});

client.on("interactionCreate", async interaction => {
    if (!interaction.isCommand()) return;
    const command = client.commands.get(interaction.commandName);
    if (!command) return;
    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
});

// Login to Discord with your client's token
client.login(process.env.token);