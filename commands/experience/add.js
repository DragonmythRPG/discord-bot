const { SlashCommandSubcommandBuilder } = require('@discordjs/builders');
const userDatabase = require("../../initDatabase.js");

module.exports = {
    data: new SlashCommandSubcommandBuilder()
        .setName('add')
        .setDescription('Add XP.')
        .addUserOption(option => option.setName(`user`).setDescription(`Select the user you wish to check.`).setRequired(true))
        .addNumberOption(option => option.setName(`value`).setDescription(`How much XP to add to user.`).setRequired(true)),
    async execute(interaction) {
        const user = interaction.options.getUser(`user`);
        const target = (user) ? user : interaction.user;
        const database = interaction.client.databases.experience;
        const value = interaction.options.getNumber(`value`);
        let data = database.get(target.id);
        if (data) {
            data.userXP += value;
            database.set(target.id, data);
        } else {
            database.set(target.id, { userID: target.id, userName: target.username, userXP: value })
            data = database.get(target.id);
        }
        userDatabase.updateDatabase(interaction.client, target);
        interaction.reply(`Added ${value} XP to <@!${target.id}>. They now have ${database.get(target.id).userXP} XP.`);
    },
};