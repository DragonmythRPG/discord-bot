const { SlashCommandSubcommandBuilder } = require('@discordjs/builders');
const userDatabase = require("../../initDatabase.js");

const data = new SlashCommandSubcommandBuilder()
    .setName('remove')
    .setDescription('Remove a member to a group.')
    .addStringOption(option =>
        option.setName(`group`)
        .setDescription(`Choose the group you wish to remove from.`)
        .setRequired(true))
    .addUserOption(option => option.setName(`user`).setDescription(`Select the user you wish to remove.`).setRequired(true));

module.exports = {
    data: getData(),
    async execute(interaction) {
        // const user = interaction.options.getUser(`user`);
        // const target = (user) ? user : interaction.user;
        // const database = interaction.client.databases.experience;
        // const value = interaction.options.getNumber(`value`);
        // let data = database.get(target.id);
        // if (data) {
        //     data.userXP += value;
        //     database.set(target.id, data);
        // } else {
        //     database.set(target.id, { userID: target.id, userName: target.username, userXP: value })
        //     data = database.get(target.id);
        // }
        // userDatabase.updateDatabase(interaction.client, target);
        // interaction.reply(`Added ${value} XP to <@!${target.id}>. They now have ${database.get(target.id).userXP} XP.`);
    },
};

function getData() {
    for (const group of client.databases.groups.values()) {
        data.options[0].addChoice(group.name, group.name);
    }
    return data;
}