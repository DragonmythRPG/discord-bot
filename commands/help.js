// const index = require('./../index.js');

const { SlashCommandBuilder } = require('@discordjs/builders');

var data = new SlashCommandBuilder()
    .setName("help")
    .setDescription("Get Help!");

data.helper = "This command allows you to get help with any and all commands run by this bot.";
// .addStringOption(option =>
//     option.setName("command")
//     .setDescription("The Command you need help with.")
//     .setRequired(false))

// const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));
// console.log(index);
// const commandFiles = index.commandFiles;
// console.log(commandFiles);

module.exports = {
    data: data,
    async execute(interaction) {
        // await interaction.delete()
        //     .then(msg => console.log(`Deleted message from ${msg.author.username}`))
        //     .catch(console.error);
        // interaction.user.send("Test");
        console.log(data);
        await interaction.reply("We're here to help!")
            .then(message => console.log(`Message sent by ${interaction.user.username}`))
            .catch(console.error);
    },
};