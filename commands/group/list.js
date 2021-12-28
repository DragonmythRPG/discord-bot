const { SlashCommandSubcommandBuilder } = require('@discordjs/builders');
const userDatabase = require("../../initDatabase.js");

const data = new SlashCommandSubcommandBuilder()
    .setName('list')
    .setDescription('List all groups and the members in them.')
    // .addStringOption(option =>
    //     option.setName(`group`)
    //     .setDescription(`Choose the group you wish to add to.`)
    //     .setRequired(true));

module.exports = {
    data: getData(),
    async execute(interaction) {

        const finalEmbed = {
            title: `Groups`,
            description: `Shows all game groups found in this server and all of the members of those groups.`,
            fields: [],
        }
        for (const group of client.databases.groups.values()) {
            // data.options[0].addChoice(group.name, group.name);
            // console.log(group.name);
            console.log(group);
            // const players = group.players.split(`;`)
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

        interaction.reply({ embeds: [finalEmbed] })

        // const group = interaction.options.getString(`group`);
        // const user = interaction.options.getUser(`user`);
        // const database = interaction.client.databases.groups;
        // console.log(database);
        // const info = database.get(group);
        // console.log(info);
        // info.players.push(user.id);
        // await database.set(group, info);
        // info.players = info.players.join(`;`);
        // userDatabase.Group.upsert(info);
        // interaction.reply(`Added <@!${user.id}> to ${group}.`);
    },
};

function getData() {
    // for (const group of client.databases.groups.values()) {
    //     data.options[0].addChoice(group.name, group.name);
    //     console.log(group.name);
    // }
    return data;
}