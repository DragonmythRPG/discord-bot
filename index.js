// import * as fs from "fs";
// import { Client, Collection, Intents, Interaction, MessageEmbed } from "discord.js";
// import * as token from "./config.json";

const dotenv = require('dotenv');

dotenv.config();

// Require the necessary discord.js classes
const fs = require('fs');
const { Client, Collection, Intents, Interaction, MessageEmbed } = require('discord.js');
// const { token } = require('./config.json');
const debug = true;
// const Discord = require('discord.js')

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
client.commands = new Collection();

global.commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));
for (const file of global.commandFiles) {
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
        for (const file of global.commandFiles) {
            const command = require(`./commands/${file}`);
            opt.addChoice(command.data.name, command.data.description);
        }
        console.log(opt)
        const deploy = require("./deploy-commands");
        deploy.registerCommands();
    }
    console.log('Ready!');
});

client.on("interactionCreate", async interaction => {
    // if (interaction.commandName == "help") {
    //     text = ''
    //     commands.forEach(command => {
    //         text += (`**${command.setName}**: \n ${command.setDescription} \n\n}`)
    //     })
    //     const embed = new MessageEmbed()
    //         .setColor('#ff0000')
    //         .setTitle('Help')
    //         .setDescription(text)
    //     await interaction.send(embed);
    // }

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