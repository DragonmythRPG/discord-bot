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
    .addUserOption(option => option.setName(`user0`).setDescription(`Select the user you wish to add.`).setRequired(true))
    .addUserOption(option => option.setName(`user1`).setDescription(`Select a user you wish to add.`).setRequired(false))
    .addUserOption(option => option.setName(`user2`).setDescription(`Select a user you wish to add.`).setRequired(false))
    .addUserOption(option => option.setName(`user3`).setDescription(`Select a user you wish to add.`).setRequired(false))
    .addUserOption(option => option.setName(`user4`).setDescription(`Select a user you wish to add.`).setRequired(false))
    .addUserOption(option => option.setName(`user5`).setDescription(`Select a user you wish to add.`).setRequired(false));

module.exports = {
    data: getData(),
    async execute(interaction) {
        // Defer reply and gather data for the following code.
        await interaction.deferReply();
        const group = interaction.options.getString(`group`);
        const users = [];
        // users.push(interaction.options.getUser(`user0`));
        for (let i = 0; i < 6; i++) {
            const user = interaction.options.getUser(`user${i}`);
            if (user) users.push(user);
        }
        console.log(users);
        const database = interaction.client.databases.groups;
        const info = database.get(group);

        // Make sure the user is not in the group, then upload to the database.
        const added = [];
        const current = [];
        users.forEach(user => {
            if (!info.players.includes(user.id)) {
                added.push(user);
                info.players.push(user.id);
                database.set(group, info);
                userDatabase.Group.upsert({ name: info.name, players: JSON.stringify(info.players) });
            } else {
                current.push(user);
            }
        })

        // Create the reply saying who was added and not added.
        let addedString = ``;
        let currentString = ``;
        for (let i = 0; i < added.length; i++) {
            if (i == 0) {
                addedString = `${added[i].username}`
            } else if (i == added.length - 1) {
                addedString = (added.length == 2) ? `${addedString} and ${added[i].username}` : `${addedString}, and ${added[i].username}`;
            } else {
                addedString = `${addedString}, ${added[i].username}`;
            }
        }
        for (let i = 0; i < current.length; i++) {
            if (i == 0) {
                currentString = `${current[i].username}`
            } else if (i == current.length - 1) {
                currentString = (current.length == 2) ? `${currentString} and ${current[i].username}` : `${currentString}, and ${current[i].username}`;
            } else {
                currentString = `${currentString}, ${current[i].username}`
            }
        }
        const plural = (current.length > 1) ? `` : `s`;
        const currentReply = (current.length > 0) ? `${currentString} already belong${plural} to ${group}. ` : ``;
        const addedReply = (added.length > 0) ? `Added ${addedString} to ${group}.` : ``;

        // Edit earlier deferment with the created reply.
        interaction.editReply(`${currentReply}${addedReply}`);
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