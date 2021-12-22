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
        client.application.commands.fetch().then(com => console.log(com));
        interaction.guild.commands.fetch()
            .then(commands => {
                console.log(`Starting this portion.`);
                let appComArr = [];
                for (const command of commands.values()) {
                    for (const opt of command.options) {
                        if (!opt.options) continue;
                        for (const choice of opt.options) {
                            if (choice.name != `group`) continue;
                            let i = 0;
                            for (const g of choice.choices) {
                                if (g.name == group) choice.choices.splice(i, 1);
                                i++;
                            }
                            console.log(choice);
                        }
                    }
                    appComArr.push(command);
                }
                interaction.guild.commands.set(appComArr);
            }).then(interaction.editReply(`Deleted ${group} out of the database.`));
    },
};

function getData() {
    for (const group of client.databases.groups.values()) {
        data.options[0].addChoice(group.name, group.name);
    }
    return data;
}