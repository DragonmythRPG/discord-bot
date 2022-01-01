const { SlashCommandSubcommandBuilder } = require('@discordjs/builders');
const userDatabase = require("../../initDatabase.js");

const data = new SlashCommandSubcommandBuilder()
    .setName('remove')
    .setDescription('Remove a member to a group.')
    .addStringOption(option =>
        option.setName(`group`)
        .setDescription(`Choose the group you wish to remove a user from.`)
        .setRequired(true))
    .addUserOption(option =>
        option.setName(`user`)
        .setDescription(`Choose the user you wish to remove from the group.`)
        .setRequired(true));

module.exports = {
    data: getData(),
    async execute(interaction) {
        // Defer reply and gather data for the following code.
        await interaction.deferReply();
        const group = interaction.options.getString(`group`);
        const user = interaction.options.getUser(`user`);
        const database = interaction.client.databases.groups;
        const info = database.get(group);

        // Check to see if user is already in group, then set response appropriately.
        const reply = (info.players.includes(user.id)) ? `${user.username} has been removed from ${group}.` : `${user.username} isn't in ${group}.`

        // Make sure the user is in the group, then remove them and upload to the database.
        if (info.players.includes(user.id)) {
            const index = info.players.indexOf(user.id);
            info.players.splice(index, 1)
            await database.set(group, info);
            userDatabase.Group.upsert({ name: info.name, players: JSON.stringify(info.players) });
        }
        console.log(client.databases.groups);

        // Edit earlier deferment.
        interaction.editReply(reply);
    },
};

function getData() {
    for (const group of client.databases.groups.values()) {
        data.options[0].addChoice(group.name, group.name);
    }
    // for (const user of client.databases.groups.values()) {
    //     data.options[0].addChoice(group.name, group.name);
    // }
    return data;
}