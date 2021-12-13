const { SlashCommandBuilder } = require('@discordjs/builders');
const utility = require("./../utility.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('repeat')
        .setDescription('this is a command showcasing the "collector" function'),
    async execute(interaction) {

        const reply = await interaction.reply({ content: 'Write something and I will repeat it!!', fetchReply: true, ephemeral: true });
        console.log(reply);
        // await interaction.reply('Write something and I will repeat it!!');

        const filter = msg => {
            msg = interaction.user.id == msg.author.id;
            return msg;
        }
        const collector = interaction.channel.createMessageCollector({ filter, time: 15000, max: 1 });

        let sent = false;

        console.log(interaction.channel);

        collector.on("collect", m => {
            console.log(m.content);
            sent = true;
            interaction.channel.send(m.content);
        });

        collector.on('end', collected => {
            console.log(`Collected ${collected.size} items`);
            if (!sent) interaction.followUp({ content: "Too slow!", ephemeral: true }).then(test => {
                console.log(test);
            });
        });
    },
};