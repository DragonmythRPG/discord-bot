const { SlashCommandSubcommandBuilder, Embed } = require("@discordjs/builders");
const userDatabase = require("../../initDatabase.js");

const data = new SlashCommandSubcommandBuilder()
    .setName("compare") //Must be lower case.
    .setDescription("Use this featue to compare times of two or more users") //Enter the description of the command.
    .addStringOption((option) =>
        option
        .setName("firstuser")
        .setDescription("Choose name of an user you want to compare to")
        .setRequired(true)
        .addChoice("Chu", `Chu`)
        .addChoice("Lewis", `Lewis`))
    .addStringOption((option) =>
        option
        .setName("seconduser")
        .setDescription("Choose name of an user you want to compare against")
        .setRequired(false)
        .addChoice("Chu", `Chu`)
        .addChoice("Lewis", `Lewis`))

module.exports = {
    data: data,
    async execute(interaction) {
        //The code that is run when the command is triggered.
        const firstUser = interaction.options.getString(`firstuser`);
        const compareUser = interaction.options.getString(`seconduser`);
        const dataBaseUser = await userDatabase.Time.findAll({
            where: {
                name: firstUser
            }
        })
        const dataBaseCompare = await userDatabase.Time.findAll({
            where: {
                name: compareUser
            }
        })
        console.log(dataBaseCompare)
        console.log(dataBaseUser)
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