const { MessageButton } = require("discord.js")
const path = require(`path`);

const customId = path.basename(__filename).split(`.`)[0]

const data = new MessageButton()
    .setCustomId(customId)
    .setLabel("DONE")
    .setStyle('SUCCESS');
data.execute = async function(interaction) {
    const embed = interaction.message.embeds[0];
    interaction.update({ embeds: [], components: [] });
}

module.exports = data;