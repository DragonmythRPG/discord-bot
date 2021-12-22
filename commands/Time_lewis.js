const { SlashCommandBuilder } = require('@discordjs/builders');

const users = {
    Chu: {
        Start_time: `17:00`,
        End_time: `19:00`
    },
    Lewis: {
        Start_time: `15:00`,
        End_time: `18:00`
    }
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('timetable') //Must be lower case.
        .setDescription('Lewis made his timetable') //Enter the description of the command.
        .addStringOption(option =>
            option
                .setName('user')
                .setDescription('Insert name of an user you want to see the timetable of')
                .setRequired(true)
                .addChoice('Chu', `${users.Chu.Start_time} - ${users.Chu.End_time}`)
                .addChoice('Lewis', `${users.Lewis.Start_time} - ${users.Lewis.End_time}`)),
    async execute(interaction) { //The code that is run when the command is triggered.
        const finalEmbed = {
            
        }
        interaction.reply({ embeds: [finalEmbed] })
    },
    
}

