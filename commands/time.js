const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton } = require('discord.js');
const utility = require("./../utility.js");

const dayMenu = {
    title: `Day`,
    description: `Which day would you like to edit?`
}

const availableMenu = {
    title: `Availability`,
    description: `Type an entry's corresponding number to edit that entry.`,
    fields: [{
        name: `Current Times`,
        value: `\`\`\`
        \`\`\``,
        inline: false,
    }],
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('time')
        .setDescription('Check the available times!'),
    async execute(interaction) {
        const finalEmbed = {
            title: `Times Available`,
            description: `The times that someone is available.`,
            fields: [{
                name: `Monday`,
                value: `${hour(0)}...................${hour(6)}...................${hour(12)}...................${hour(18)}...................${hour(24)}
                :red_square::yellow_square::green_square::red_square::red_square::red_square::red_square::red_square::red_square::red_square::red_square::red_square::red_square::red_square::red_square::red_square::red_square::red_square::red_square::red_square::red_square::red_square::red_square::red_square:`,
                inline: false,
            }, {
                name: `Tuesday`,
                value: `${hour(0)}...................${hour(6)}...................${hour(12)}...................${hour(18)}...................${hour(24)}
                :red_square::yellow_square::green_square::red_square::red_square::red_square::red_square::red_square::red_square::red_square::red_square::red_square::red_square::red_square::red_square::red_square::red_square::red_square::red_square::red_square::red_square::red_square::red_square::red_square:`,
                inline: false,
            }, {
                name: `Wednesday`,
                value: `${hour(0)}...................${hour(6)}...................${hour(12)}...................${hour(18)}...................${hour(24)}
                :red_square::yellow_square::green_square::red_square::red_square::red_square::red_square::red_square::red_square::red_square::red_square::red_square::red_square::red_square::red_square::red_square::red_square::red_square::red_square::red_square::red_square::red_square::red_square::red_square:`,
                inline: false,
            }, {
                name: `Thursday`,
                value: `${hour(0)}...................${hour(6)}...................${hour(12)}...................${hour(18)}...................${hour(24)}
                :red_square::yellow_square::green_square::red_square::red_square::red_square::red_square::red_square::red_square::red_square::red_square::red_square::red_square::red_square::red_square::red_square::red_square::red_square::red_square::red_square::red_square::red_square::red_square::red_square:`,
                inline: false,
            }, {
                name: `Friday`,
                value: `${hour(0)}...................${hour(6)}...................${hour(12)}...................${hour(18)}...................${hour(24)}
                :red_square::yellow_square::green_square::red_square::red_square::red_square::red_square::red_square::red_square::red_square::red_square::red_square::red_square::red_square::red_square::red_square::red_square::red_square::red_square::red_square::red_square::red_square::red_square::red_square:`,
                inline: false,
            }, {
                name: `Saturday`,
                value: `${hour(0)}...................${hour(6)}...................${hour(12)}...................${hour(18)}...................${hour(24)}
                :red_square::yellow_square::green_square::red_square::red_square::red_square::red_square::red_square::red_square::red_square::red_square::red_square::red_square::red_square::red_square::red_square::red_square::red_square::red_square::red_square::red_square::red_square::red_square::red_square:`,
                inline: false,
            }, {
                name: `Sunday`,
                value: `${hour(0)}...................${hour(6)}...................${hour(12)}...................${hour(18)}...................${hour(24)}
                :red_square::yellow_square::green_square::red_square::red_square::red_square::red_square::red_square::red_square::red_square::red_square::red_square::red_square::red_square::red_square::red_square::red_square::red_square::red_square::red_square::red_square::red_square::red_square::red_square:`,
                inline: false,
            }, ]
        }
        const buttons = interaction.client.buttons;
        const actRow = new MessageActionRow()
            .addComponents(buttons.get(`addTime`))
            .addComponents(buttons.get(`clearTimes`))
            .addComponents(buttons.get(`finishTimes`))
        const filter = msg => interaction.user.id == msg.author.id;
        const user = interaction.user;
        const channel = await user.createDM();
        interaction.reply({ content: `Sent you a direct message.`, ephemeral: true })
            // interaction.reply({ embeds: [finalEmbed] })

        await user.send({ embeds: [availableMenu], components: [actRow] });
        // await interaction.reply({ embeds: [finalEmbed] });

        async function getResponse() {
            const response = await channel.awaitMessages({ filter, max: 1, time: 900000 });
            if (response.at(0)) return response.at(0).content;
            user.send({ embeds: [timeout] });
            return false;
        }
    },
};

function hour(hour) {
    const time = new Date().setHours(hour, 0, 0, 0);
    return `<t:${time / 1000}:t>`;
}

function times() {
    let final = ``;
    for (let i = 0; i < 23; i++) {
        final = final + `<t:${hour(i)}:t>`;
    }
    return final;
}