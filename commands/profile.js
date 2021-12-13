const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('profile')
        .setDescription('View the profile of yourself or (by mentioning them) of someone else.'),
    async execute(interaction) {
        await interaction.reply('--Profile--')
    },
};