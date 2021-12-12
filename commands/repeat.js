const { SlashCommandBuilder } = require('@discordjs/builders');
const utility = require("./../utility.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('repeat')
        .setDescription('this is a command showcasing the "collector" function'),
    async execute(interaction) {

        // await interaction.reply('Write something and I will repeat it!!', { fetchReply: true })
        await interaction.reply('Write something and I will repeat it!!')

        let msg = await utility.collect(interaction);
        // interaction.channel.send(msg);

        // const filter = m => {
        //     console.log(m);
        //     m = interaction.user.id == m.author.id;
        //     console.log(m);
        //     return m;
        // }
        // const collector = interaction.channel.createMessageCollector({ filter, time: 15000, max: 1 });

        // collector.on("collect", m => {
        //     console.log(m.content);
        //     interaction.channel.send(m.content);
        // });

        // collector.on('end', collected => {
        //     console.log(`Collected ${collected.size} items`);
        // });
    },
};