const { SlashCommandSubcommandBuilder } = require('@discordjs/builders');
const userDatabase = require("../../initDatabase.js");

// Build initial slash command to add choices to in getData().
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
        // Defer reply and gather data for the following code.
        await interaction.deferReply();
        const group = interaction.options.getString(`group`);
        const user = interaction.options.getUser(`user`);
        const database = interaction.client.databases.groups;
        const info = database.get(group);

        // Check to see if user is already in group, then set response appropriately.
        const reply = (info.players.includes(user.id)) ? `${user.username} already belongs to ${group}.` : `Added ${user.username} to ${group}.`

        // Make sure the user is not in the group, then upload to the database.
        if (!info.players.includes(user.id)) {
            info.players.push(user.id);
            await database.set(group, info);
            userDatabase.Group.upsert({ name: info.name, players: info.players.join(`;`) });
        }

        // Edit earlier deferment.
        interaction.editReply(reply);
    },
};

// Add all groups to the option choices.
function getData() {
    for (const group of client.databases.groups.values()) {
        data.options[0].addChoice(group.name, group.name);
        console.log(group.name);
    }
    return data;
}