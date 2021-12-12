const { SlashCommandBuilder } = require('@discordjs/builders');
const utility = require("./../utility.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('test')
        .setDescription('Test!'),
    async execute(interaction) {
        utility.test("Test")
        await interaction.reply("Testing");
        // .then(interaction.deleteReply())
        // .then(interaction.reply("Ping!"));
    },
};