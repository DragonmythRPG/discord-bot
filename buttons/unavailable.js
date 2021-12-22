const { MessageButton, MessageEmbed } = require("discord.js")
const path = require(`path`);

const customId = path.basename(__filename).split(`.`)[0]

const data = new MessageButton()
    .setCustomId(customId)
    .setLabel("UNAVAILABLE")
    .setStyle('DANGER');
data.execute = async function(interaction) {
    const embed = interaction.message.embeds[0];
    const unsure = embed.fields[1];
    const clicked = embed.fields[4];
    const userMention = `<@!${interaction.user.id}>`;
    const reg = new RegExp(`${userMention} *(\\n)*`, `g`);
    let repeat;
    for (const field of embed.fields) {
        if (field == clicked) {
            repeat = reg.test(field.value);
            continue;
        } else {
            field.value = field.value.replace(reg, ``);
            if (!field.value) field.value = `\u200b`;
        }
    }
    const mentions = clicked.value.matchAll(/(<@!)[0-9]*>/g);
    let str = ``;
    for (const mention of mentions) {
        if (mention[0] == userMention) continue;
        str = `${str}${mention[0]}
        `;
    }
    if (repeat) {
        unsure.value = `${unsure.value}\n${userMention}`
    } else {
        str = `${str}${userMention}
    `;
    }
    clicked.value = (str) ? str : `\u200b`;
    interaction.update({ embeds: [new MessageEmbed(embed)] });
}

module.exports = data;