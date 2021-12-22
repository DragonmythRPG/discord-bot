const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('template') //Must be lower case.
        .setDescription('Description'), //Enter the description of the command.
    async execute(interaction) { //The code that is run when the command is triggered.

    },
}