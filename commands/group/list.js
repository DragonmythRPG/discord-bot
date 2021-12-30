const { SlashCommandSubcommandBuilder } = require('@discordjs/builders');
const userDatabase = require("../../initDatabase.js");
const groups = require('../../models/groups.js');

// Create data for subcommand in the slash system.
const data = new SlashCommandSubcommandBuilder()
    .setName('list')
    .setDescription('List all groups and the members in them.');

module.exports = {
    data: data,
    async execute(interaction) {
        // Create initial embed with empty fields.
        const finalEmbed = {
            title: `Groups`,
            description: `Shows all game groups found in this server and all of the members of those groups.`,
            fields: [],
        }

        // Sort groups in alphabetic order.
        const groups = [];
        for (const group of client.databases.groups.values()) {
            groups.push(group)
        }
        groups.sort((a, b) => {
            if (a.name < b.name) return -1;
            if (a.name > b.name) return 1;
            return 0;
        });

        // Create fields for each group to add to embed.
        for (const group of groups) {
            let str = `----------`;
            group.players.forEach(player => {
                str = `${str}
                <@!${player}>`
            })
            const field = {
                name: group.name,
                value: str,
                inline: true,
            }
            finalEmbed.fields.push(field);
        }

        // Send embed reply.
        interaction.reply({ embeds: [finalEmbed] })
    },
};