const { SlashCommandSubcommandBuilder } = require('@discordjs/builders');
const userDatabase = require("../../initDatabase.js");

module.exports = {
    data: getData(),
    async execute(interaction) {
        const user = interaction.options.getUser(`user`);
        const target = (user) ? user : interaction.user;
        const database = interaction.client.databases.users;
        const value = interaction.options.getNumber(`value`);
        let data = database.get(target.id);
        if (data) {
            data.userXP += value;
            database.set(target.id, data);
        } else {
            database.set(target.id, { userID: target.id, userName: target.username, userXP: value })
            data = database.get(target.id);
        }
        userDatabase.User.upsert(client.databases.users.get(target.id));
        interaction.reply(`Added ${value} XP to <@!${target.id}>. They now have ${database.get(target.id).userXP} XP.`);
    },
};

function getData() {
    const data = new SlashCommandSubcommandBuilder()
        .setName('add')
        .setDescription('Add XP.')
        .addUserOption(option => option.setName(`user`).setDescription(`Select the user you wish to check.`).setRequired(true))
        .addNumberOption(option => option.setName(`value`).setDescription(`How much XP to add to user.`).setRequired(true));
    data.type = `CHAT_INPUT`;
    return data;
}