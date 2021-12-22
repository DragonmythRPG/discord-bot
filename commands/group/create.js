const { SlashCommandSubcommandBuilder } = require('@discordjs/builders');
const userDatabase = require("../../initDatabase.js");
const initCommands = require("../../initCommands.js");

const dotenv = require('dotenv');

dotenv.config();

const data = new SlashCommandSubcommandBuilder()
    .setName('create')
    .setDescription('Create a group.')
    .addStringOption(option =>
        option.setName(`name`)
        .setDescription(`Choose the name of the group.`)
        .setRequired(true));

module.exports = {
    data: data,
    async execute(interaction) {
        await interaction.deferReply();
        const group = interaction.options.getString(`name`);
        const database = interaction.client.databases.groups;
        let taken = false;
        for (const val of database.values()) {
            if (val.name == group) {
                taken = true;
                interaction.reply({ content: `This group name is already taken. Please attempt again with a different name.`, ephemeral: true })
            }
        }
        if (taken) return false;
        await database.set(group, { name: group, players: `` });
        userDatabase.Group.upsert(client.databases.groups.get(group));
        console.log(`About to start.`);
        // const commands = await client.application.commands.fetch();
        console.log(interaction.guild.commands);
        const commands = await interaction.guild.commands.fetch();
        // const commands = initCommands.appCommands;
        console.log(commands);
        console.log(`Starting this portion.`);
        let appComArr = [];
        for (const command of commands.values()) {
            for (const opt of command.options) {
                if (!opt.options) continue;
                for (const choice of opt.options) {
                    if (choice.name != `group`) continue;
                    choice.choices.push({ name: group, value: group });
                }
            }
            appComArr.push(command);
        }
        console.log(appComArr);
        console.log(`Setting the Commands`);
        await interaction.guild.commands.set(appComArr);
        console.log(`Setting the Global`);
        await client.application.commands.set([]);
        initCommands.appCommands = await interaction.guild.commands.fetch();
        interaction.editReply(`Created ${group} and added it to the database.`);
    },
};