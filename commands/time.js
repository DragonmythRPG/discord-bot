const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require("discord.js");

const event = new MessageEmbed()
    .setTitle("Available Times")
    .setDescription("What days/times will you be available?");

const event2 = {
    title: "Testing Embed Event",
    description: "This is just a test. No need for alarm.",
    timestamp: new Date()
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName("event")
        .setDescription('Create an event.'),
    async execute(interaction) {
        const user = interaction.user;
        const direct = await user.createDM();
        user.send("Testing");

        interaction.reply({ content: "Dragonmyth has sent you a direct message!", fetchReply: true, ephemeral: true });
        // console.log(reply);
        // await interaction.reply('Write something and I will repeat it!!');

        const filter = msg => {
            msg = interaction.user.id == msg.author.id;
            return msg;
        }
        const collector = direct.createMessageCollector({ undefined, time: 15000, max: 1 });

        let sent = false;

        collector.on("collect", m => {
            console.log(m.content);
            sent = true;
            direct.send(m.content);
        });

        collector.on("end", collected => {
            console.log(`Collected ${collected.size} items`);
            if (!sent) interaction.followUp({ content: "Too slow!", ephemeral: true }).then(test => {
                console.log(test);
            });
        });

        // console.log(event);
        // await interaction.reply('Loading...', { ephemeral: true })
        // interaction.deleteReply();
        // const channel = interaction.channel;
        // await channel.send({ embeds: [event2] });
    },
};