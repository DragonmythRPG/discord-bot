const { SlashCommandBuilder } = require('@discordjs/builders');
const { Collection } = require('discord.js');
const fs = require('fs');

const data = new SlashCommandBuilder()
    .setName('experience')
    .setDescription('Experience Commands');

const subcommands = new Collection()
const subcommandFiles = fs.readdirSync(`./commands/${data.name}`).filter(file => file.endsWith(".js"));

function getData() {
    for (const file of subcommandFiles) {
        const subcommand = require(`./${data.name}/${file}`);
        data.addSubcommand(sub => sub = subcommand.data);
        subcommands.set(subcommand.data.name, subcommand);
    }
    data.type = `CHAT_INPUT`;
    console.log(data);
    return data;
}

module.exports = {
    data: getData(),
    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();
        subcommands.get(subcommand).execute(interaction);
    },
};