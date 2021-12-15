const { SlashCommandSubcommandBuilder } = require('@discordjs/builders');
const userDatabase = require("../../initDatabase.js");

module.exports = {
    data: new SlashCommandSubcommandBuilder()
        .setName('check')
        .setDescription('Check your XP.')
        .addUserOption(option => option.setName(`user`).setDescription(`Select the user you wish to check.`)),
    async execute(interaction) {
        const database = interaction.client.databases.experience;
        const user = interaction.options.getUser(`user`);
        const target = (user) ? user : interaction.user;
        let data = database.get(target.id);
        if (!data) {
            data = { userID: target.id, userName: target.username, userXP: 0 };
            database.set(target.id, data);
            userDatabase.updateDatabase(interaction.client, target);
        }
        console.log(target);
        console.log(database);
        interaction.reply(`<@!${target.id}> has ${data.userXP} XP.`);
    },
};