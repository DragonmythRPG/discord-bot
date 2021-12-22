const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mute')
        .setDescription('Mute a user.')
        .addUserOption(option => option.setName(`user`).setDescription(`Choose the user you wish to mute.`).setRequired(true)),
    async execute(interaction) {
        const target = interaction.options.getUser(`user`);
        interaction.reply({ content: `Muting ${target.username}`, ephemeral: true });
        const member = await interaction.guild.members.fetch(target.id);
        member.voice.setMute(true);
    },
};