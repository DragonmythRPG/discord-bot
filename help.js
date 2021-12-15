const fs = require('fs');
const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));
const { SlashCommandBuilder } = require('@discordjs/builders');

const data = new SlashCommandBuilder()
    .setName("help")
    .setDescription("Get Help!");

function getData() {
    data.helper = "This command allows you to get help with any and all commands run by this bot.";
    let opt;
    data.addStringOption(option => {
        option
            .setName("command")
            .setDescription("The command you need help with.");
        opt = option;
        return option;
    });
    for (const file of commandFiles) {
        if (file == data.name) continue;
        const command = require(`./commands/${file}`);
        opt.addChoice(command.data.name, command.data.description);
    }
    return data;
}

module.exports = {
    data: getData(),
    async execute(interaction) {
        let command = interaction.options.getString("command");
        if (!command) command = data.description;
        await interaction.reply(command)
            .catch(console.error);
    },
};