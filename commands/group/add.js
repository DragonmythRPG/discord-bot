const { SlashCommandSubcommandBuilder } = require('@discordjs/builders');
const userDatabase = require("../../initDatabase.js");

const data = new SlashCommandSubcommandBuilder()
    .setName('add')
    .setDescription('Add a member to a group.')
    .addStringOption(option =>
        option.setName(`group`)
        .setDescription(`Choose the group you wish to add to.`)
        .setRequired(true))
    .addUserOption(option => option.setName(`user`).setDescription(`Select the user you wish to add.`).setRequired(true));

module.exports = {
    data: getData(),
    async execute(interaction) {
        const group = interaction.options.getString(`group`);
        const user = interaction.options.getUser(`user`);
        const database = interaction.client.databases.groups;
        const info = database.get(group);
        info.players.push(user.id);
        await database.set(group, info);
        info.players = info.players.join(`;`);
        userDatabase.Group.upsert(info);
        interaction.reply(`Added <@!${user.id}> to ${group}.`);
    },
};

function getData() {
    for (const group of client.databases.groups.values()) {
        data.options[0].addChoice(group.name, group.name);
        console.log(group.name);
    }
    data.type = `CHAT_INPUT`;
    return data;
}