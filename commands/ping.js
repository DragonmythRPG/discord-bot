const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with Pong!'),
    async execute(interaction) {
        await interaction.reply('Loading...')
            .then(interaction.channel.send(`Latency is ${Date.now() - interaction.createdTimestamp}ms.`))
            .then(interaction.deleteReply())
            .then(interaction.folloup("Ping!"));
    },
};