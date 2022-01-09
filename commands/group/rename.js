const { SlashCommandSubcommandBuilder } = require('@discordjs/builders');
const userDatabase = require("../../initDatabase.js");

const data = new SlashCommandSubcommandBuilder()
    .setName('rename')
    .setDescription('Rename a group.')
    .addStringOption(option =>
        option.setName(`group`)
        .setDescription(`Choose the group you wish to rename.`)
        .setRequired(true))
    .addStringOption(option =>
        option.setName(`name`)
        .setDescription(`Choose a new name for the group.`)
        .setRequired(true));

module.exports = {
    data: getData(),
    async execute(interaction) {
        await interaction.deferReply();
        console.log(`Executing`);
        const group = interaction.options.getString(`group`);
        const name = interaction.options.getString(`name`);
        const database = interaction.client.databases.groups;
        const getDatabase = database.get(group);
        console.log(getDatabase);
        database.set(name, { name: name, players: getDatabase.players })
        console.log(database.get(name));
        database.delete(group)
        console.log(database);
        await userDatabase.Group.update({
            name: name,
        }, {
            where: {
                name: group
            }
        });

        for (const command of client.appCommands.values()) {
            for (const opt of command.options) {
                if (!opt.options) continue;
                for (const choice of opt.options) {
                    if (choice.name != `group`) continue;
                    if (!Array.isArray(choice.choices)) choice.choices = [];
                    console.log(command);
                    console.log(choice);
                    let i = 0;
                    for (const g of choice.choices) {
                        console.log(`i`);
                        console.log(i);
                        if (g.name == group) choice.choices.splice(i, 1);
                        i++;
                    }
                    choice.choices.push({ name: name, value: name });
                    choice.choices.sort();
                }
            }
        }
        console.log(client.appCommands.toJSON());
        await interaction.guild.commands.set(client.appCommands.toJSON());
        interaction.editReply(`Renamed ${group} to ${name}.`);
    },
};

function getData() {
    for (const group of client.databases.groups.values()) {
        data.options[0].addChoice(group.name, group.name);
    }
    return data;
}