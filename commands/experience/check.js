const { SlashCommandSubcommandBuilder } = require('@discordjs/builders');
const userDatabase = require("../../initDatabase.js");

module.exports = {
    data: getData(),
    async execute(interaction) {
        const database = interaction.client.databases.users;
        const user = interaction.options.getUser(`user`);
        const target = (user) ? user : interaction.user;
        let data = database.get(target.id);
        if (!data) {
            data = { userID: target.id, userName: target.username, userXP: 0 };
            database.set(target.id, data);
            userDatabase.updateUser(interaction.client, target);
        }
        interaction.reply(`<@!${target.id}> has ${data.userXP} XP.`);
    },
};

function getData() {
    const data = new SlashCommandSubcommandBuilder()
        .setName('check')
        .setDescription('Check your XP.')
        .addUserOption(option => option.setName(`user`).setDescription(`Select the user you wish to check.`));
    data.type = `CHAT_INPUT`;
    return data;
}