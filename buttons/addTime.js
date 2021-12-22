const { MessageButton } = require("discord.js")
const path = require(`path`);

const customId = path.basename(__filename).split(`.`)[0]

const data = new MessageButton()
    .setCustomId(customId)
    .setLabel("ADD")
    .setStyle('PRIMARY');
data.execute = async function(interaction) {
    interaction.reply(`Testing`);
}

module.exports = data;