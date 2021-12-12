const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('roll')
        .setDescription('Roll!'),
    async execute(interaction) {
        await interaction.reply('Loading...')
            // .then(interaction.deleteReply())
            // .then(interaction.reply("Ping!"));
    },
};