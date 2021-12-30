const { SlashCommandSubcommandBuilder } = require('@discordjs/builders');
const userDatabase = require("../../initDatabase.js");

const data = new SlashCommandSubcommandBuilder()
    .setName('delete')
    .setDescription('Delete a group.')
    .addStringOption(option =>
        option.setName(`group`)
        .setDescription(`Choose the name of the group.`)
        .setRequired(true));

module.exports = {
    data: getData(),
    async execute(interaction) {
        await interaction.deferReply();
        const group = interaction.options.getString(`group`);
        const database = interaction.client.databases.groups;
        database.delete(group);
        userDatabase.Group.destroy({
            where: {
                name: group
            }
        });

        // client.application.commands.fetch().then(com => console.log(com));
        // interaction.guild.commands.fetch()
        //     .then(commands => {
        //         let appComArr = [];
        //         for (const command of commands.values()) {
        //             for (const opt of command.options) {
        //                 console.log(`Getting ${opt.name} options now.`);
        //                 if (!opt.options) continue;
        //                 for (const choice of opt.options) {
        //                     console.log(`Getting ${choice.name} choices now.`);
        //                     if (choice.name != `group`) continue;
        //                     let i = 0;
        //                     for (const g of choice.choices) {
        //                         if (g.name == group) choice.choices.splice(i, 1);
        //                         i++;
        //                     }
        //                     console.log(choice);
        //                 }
        //             }
        //             console.log(`Pushing now.`);
        //             appComArr.push(command);
        //         }
        //         console.log(`Setting now.`);
        //         interaction.guild.commands.set(appComArr);
        //     }).then(interaction.editReply(`Deleted ${group} out of the database.`));

        for (const command of client.appCommands.values()) {
            for (const opt of command.options) {
                if (!opt.options) continue;
                for (const choice of opt.options) {
                    if (choice.name != `group`) continue;
                    let i = 0;
                    for (const g of choice.choices) {
                        if (g.name == group) choice.choices.splice(i, 1);
                        i++;
                    }
                    console.log(command);
                    console.log(choice);
                    choice.choices.sort();
                    // choice.choices.push({ name: group, value: group });
                }
            }
        }
        console.log(client.appCommands.toJSON());
        await interaction.guild.commands.set(client.appCommands.toJSON());
        interaction.editReply(`Created ${group} and added it to the database.`);
    },
};

function getData() {
    for (const group of client.databases.groups.values()) {
        data.options[0].addChoice(group.name, group.name);
    }
    return data;
}