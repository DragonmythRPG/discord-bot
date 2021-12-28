const { SlashCommandSubcommandBuilder, Embed } = require("@discordjs/builders");
const userDatabase = require("../../initDatabase.js");

const data = new SlashCommandSubcommandBuilder()
    .setName("user") //Must be lower case.
    .setDescription("Use this featue to compare times of two or more users") //Enter the description of the command.
    .addStringOption((option) =>
        option
        .setName("name")
        .setDescription("Choose name of an user you want to compare to")
        .setRequired(true))
module.exports = {
    data: getData(),
    async execute(interaction) {
        //The code that is run when the command is triggered.
        const name = interaction.options.getString(`name`);
        const dataBaseUser = await userDatabase.Time.findAll({
            where: {
                name: name
            }
        })
        const dataBaseCompare = await userDatabase.Time.findAll({
            where: {
                name: compareUser
            }
        })
        const finalEmbed = {
            title: `Timetables`,
            description: `Times for ${dataBaseUser[0].dataValues.name} and ${dataBaseCompare[0].dataValues.name}`,
            fields: [
                { name: `Time for ${dataBaseUser[0].dataValues.name}`, value: `${dataBaseUser[0].dataValues.startTime} - ${dataBaseUser[0].dataValues.endTime}` },
                { name: `Time for ${dataBaseCompare[0].dataValues.name}`, value: `${dataBaseCompare[0].dataValues.startTime} - ${dataBaseCompare[0].dataValues.endTime}` }
            ]

        };
        interaction.reply({ embeds: [finalEmbed] });
    },
};

function getData() {
    console.log(client)
    for (const time of client.databases.times.values()) {
        data.options[0].addChoice(time.name, time.name);
    }
    return data;
}