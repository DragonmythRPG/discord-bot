const { MessageButton } = require("discord.js");
const path = require(`path`);
const matching = require(`closest-match`);

const customId = path.basename(__filename).split(`.`)[0]

const timeout = {
    title: "Session Timed Out",
    description: "You took longer than 15 minutes and so this session has been closed."
}

const data = new MessageButton()
    .setCustomId(customId)
    .setLabel("ADD")
    .setStyle('PRIMARY');
data.execute = async function(interaction) {
    const filter = msg => interaction.user.id == msg.author.id;
    const client = interaction.client;
    const embed = interaction.message.embeds[0];
    const actRow = interaction.message.components[0];
    console.log(embed);
    const guildID = embed.footer.text.match(/[0-9]+/)[0];
    console.log(guildID);
    let promiseRoles;
    client.guilds.fetch(guildID).then(async function(guild) {
        promiseRoles = guild.roles.fetch();
    });
    const channel = interaction.user.dmChannel;
    const ask = interaction.reply(`Type the name of a group. To add more than one group at a time, separate each one with a semicolon(;).`);
    const response = await getResponse();
    const groupList = await parseGroup(response);
    let str = ``;
    for (const group of groupList) {
        str = `${str}${group}
        `;
    }
    embed.description = str;
    interaction.update({ embeds: [embed] });

    async function getResponse() {
        const response = await channel.awaitMessages({ filter, max: 1, time: 900000 });
        if (response.at(0)) return response.at(0).delete();
        if (response.at(0)) return response.at(0).content;
        user.send({ embeds: [timeout] });
        return false;
    }

    async function parseGroup(response) {
        const responseArr = response.split(`;`);
        const roleList = [];
        const groups = [];
        const roles = await promiseRoles;
        for (const role of roles.values()) {
            roleList.push(role.name);
        }
        for (const res of responseArr) {
            groups.push(matching.closestMatch(res, roleList));
        }
        console.log(roleList);
        console.log(groups);
        return groups;
        // promiseRoles.then(roles => {
        // }).then();
    }
}

module.exports = data;