const { SlashCommandBuilder, Embed } = require('@discordjs/builders');
const { MessageEmbed, MessageButton, MessageActionRow } = require("discord.js");
const utility = require('../utility');
const emojies = require('../utilities/emojies.js');

const order = "dd-mm"

const dateFormats = [{
    name: "yyyy-mm-dd",
    reg: /^[0-9]{4}[-,. \/]+[0-9]{2}[-,. \/]+[0-9]{2}?$/,
    value: "test"
}, {
    name: `${order}-yyyy`,
    reg: /^[0-9]{2}[-,. \/]+[0-9]{2}[-,. \/]+[0-9]{4}?$/,
    value: "test"
}, {
    name: "MMM-dd-yyyy",
    reg: /^[A-Za-z]{3}[-,. \/]+[0-9]{2}[-,. \/]+[0-9]{4}?$/,
    value: "test"
}, {
    name: "dd-MMM-yyyy",
    reg: /^[0-9]{2}[-,. \/]+[A-Za-z]{3}[-,. \/]+[0-9]{4}?$/,
    value: "test"
}, {
    name: "MMM-dd",
    reg: /^[A-Za-z]{3}[-,. \/]+[0-9]{2}?$/,
    value: "test"
}, {
    name: "dd-MMM",
    reg: /^[0-9]{2}[-,. \/]+[A-Za-z]{3}?$/,
    value: "test"
}];
const timeFormats = [{
    name: "hh:mm",
    reg: /^[0-9]{2}[: ][0-9]{2}?$/,
    value: "test"
}, {
    name: `hhmm`,
    reg: /^[0-9]{4}?$/,
    value: "test"
}, {
    name: `hh:mm dd`,
    reg: /^[0-9]+[: ]*[0-9]{2}[: ]*[A-Za-z]{2}?$/,
    value: "test"
}, {
    name: `hhmmdd`,
    reg: /^[0-9]+[: ]*[A-Za-z]{2}?$/,
    value: "test"
}];

const titleEmbed = {
    title: "Title",
    description: "Please enter the title of the event."
}

const descriptionEmbed = {
    title: "Description",
    description: `Please enter any description of the event if there is one. Otherwise, write "none".`
}

const dateEmbed = {
    title: "Date",
    description: "Please enter the date of the event.",
    fields: [{
        name: "Examples:",
        value: `January 24 2022
            01/24/2022
            24 Jan 2022
            2022-01-24`
    }]
}

const timeEmbed = {
    title: "Time",
    description: "Please enter the time you would like the event to start.",
    fields: [{
        name: "Examples:",
        value: `14:45
        1445
        2:45pm
        245pm`
    }]
}

const offsetEmbed = {
    title: "Timezone",
    description: `The current UTC date/time is ${new Date().toUTCString()}.
    How many hours are you ahead or behind? Use negative numbers for being behind UTC.
    Note: you can write it as a decimal (ex. 1.5) if you live in an odd timezone.`
}

const formatFail = {
    title: "Format Unreadable",
    description: "We were unable to read your format. Please try again."
}

const timeout = {
    title: "Session Timed Out",
    description: "You took longer than 15 minutes and so this session has been closed."
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName("event")
        .setDescription('Create an event.'),
    async execute(interaction) {
        const user = interaction.user;
        const channel = await user.createDM();
        const buttons = interaction.client.buttons;
        // interaction.guild.roles.fetch() //.then(roles => console.log(roles.values()))
        //     .then(roles => roles.forEach(role => {
        //         console.log(role.name);
        //         console.log(role.id);
        //     }));
        const prom = interaction.reply({ content: `${user.username} is creating an event...`, fetchReply: true });
        // let title = await getTitle();
        let title = `Test Session`;
        console.log(title);
        if (!title) return false;
        // let description = await getDescription();
        let description = `\u200b`;
        console.log(description);
        if (!description) return false;
        // let date = await getDate();
        let date = { year: 2021, month: 11, day: 20 }
        console.log(date);
        if (!date) return false;
        // let time = await getTime();
        let time = { hour: 15, minute: 0 }
        console.log(time);
        if (!time) return false;
        // let offset = await getOffset();
        let offset = 2;
        console.log(offset);
        let str = `\u200b`;
        let groups = await getGroups()
            // .then(group => {
            //     group.members.forEach(member => {
            //         str = `${str}<@!${member.id}>
            //         `;
            //     });
            // });
            // let groups = await interaction.guild.roles.fetch(`922242933325959200`);
            // group.members.forEach(member => {
            //     str = `${str}<@!${member.id}>
            //     `;
            // });
            // description = str;
        let dateTime = new Date(date.year, date.month, date.day, time.hour - offset, time.minute).getTime() / 1000
        let attending = `\u200b`;
        const actRow = new MessageActionRow()
            .addComponents(buttons.get(`attending`))
            .addComponents(buttons.get(`sitting`))
            .addComponents(buttons.get(`unavailable`));

        const finalEvent = {
            title: title,
            description: description,
            timestamp: new Date(),
            fields: [{
                name: `When:`,
                value: `<t:${dateTime}:F>
                <t:${dateTime}:R>`,
                inline: false,
            }, {
                name: `Unsure`,
                value: str,
                inline: false,
            }, {
                name: `Attending`,
                value: `\u200b`,
                inline: true,
            }, {
                name: `Sitting Out`,
                value: `\u200b`,
                inline: true,
            }, {
                name: `Unavailable`,
                value: `\u200b`,
                inline: true,
            }],
            image: { url: `https://i.imgur.com/U8ckyoI.png` },
        };
        console.log(finalEvent);
        prom.then(msg => msg.delete());
        // user.send({ embeds: [finalEvent] });
        // const message = await interaction.channel.send({ embeds: [finalEvent], components: [actRow] });

        async function getResponse() {
            const filter = msg => interaction.user.id == msg.author.id;
            const response = await channel.awaitMessages({ filter, max: 1, time: 900000 });
            if (response.at(0)) return response.at(0).content;
            user.send({ embeds: [timeout] });
            return false;
        }

        async function getReaction(msg, limit) {
            const filter = (reaction, user) => true;
            const response = await msg.awaitReactions({ filter, max: limit, time: 900000 });
            console.log(response);
            return response;
            // if (response.at(0)) return response.at(0).content;
            // user.send({ embeds: [timeout] });
            // return false;
        }

        async function getTitle() {
            user.send({ embeds: [titleEmbed] });
            const response = await getResponse();
            if (!response) return false;
            return response;
        }

        async function getDescription() {
            user.send({ embeds: [descriptionEmbed] });
            const response = await getResponse();
            if (!response) return false;
            if (response.match(/^[A-Za-z]+/)[0].toLowerCase() == "none") return `\u200b`;
            return response;
        }

        async function getDate(bool = false) {
            if (bool) { user.send({ embeds: [formatFail] }); } else { user.send({ embeds: [dateEmbed] }); }
            const response = await getResponse();
            if (!response) return false;
            // let formatted;
            // dateFormats.forEach(format => {
            //     if (format.reg.test(response)) formatted = format;
            // });
            // if (!formatted) return getDate(true);
            // let final = {}
            // const a = formatted.name.split("-");
            // const b = response.split(/[-,. \/]+/);
            // for (let i = 0; i < a.length; i++) {
            //     let str = a[i];
            //     switch (true) {
            //         case /^d+/.test(str):
            //             final.day = parseInt(b[i]);
            //             break;
            //         case /^m+/.test(str):
            //             final.month = parseInt(b[i]);
            //             break;
            //         case /^y+/.test(str):
            //             final.year = parseInt(b[i]);
            //             break;
            //         case /^M+/.test(str):
            //             final.month = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"].indexOf(b[i].substring(0, 3).toLowerCase());
            //             break;
            //     }
            // }
            return utility.getDate(response);
        }

        async function getTime(bool) {
            if (bool) { user.send({ embeds: [formatFail] }); } else { user.send({ embeds: [timeEmbed] }); }
            const response = await getResponse();
            if (!response) return false;
            // let formatted;
            // timeFormats.forEach(format => {
            //     if (format.reg.test(response)) formatted = true;
            // });
            // if (!formatted) return getTime(true);
            // let d = response.match(/[A-Za-z]{2}/);
            // let pm = 0;
            // if (d && d[0].toLowerCase() == "pm") pm = 12;
            // // const c = response.match(/[0-9]{2}[: ]*[0-9]{2}/)
            // // const pmReg = ;
            // let t = response.replaceAll(/[A-Za-z: ]/ig, "");
            // console.log(d);
            // console.log(t);
            // while (t.length < 4) {
            //     t = `0${t}`
            // }
            // let final = {
            //     hour: parseInt(t.substring(0, 2)) + pm,
            //     minute: parseInt(t.substring(2, 4))
            // };
            return utility.getTime(response);
        }

        async function getOffset(bool) {
            if (bool) { user.send({ embeds: [formatFail] }); } else { user.send({ embeds: [offsetEmbed] }); }
            const response = await getResponse();
            if (!response) return false;
            if (!/^[-+]*[0-9]+.*[0-9]*?$/.test(response)) return getOffset(true);
            let fl = parseFloat(response);
            console.log(fl);

            return Math.round(fl * 60);
        }

        async function getGroups() {
            // Defer reply and gather data for the following code.
            const groups = client.databases.groups.values();

            console.log(interaction.guild.id);
            const roles = await interaction.guild.roles.fetch()
            const roleList = [];
            // const groups = [];
            // for (const role of roles.values()) {
            //     groups.push(role.name);
            // }
            // for (const res of responseArr) {
            //     groups.push(matching.closestMatch(res, roleList));
            // }
            console.log(roleList);
            console.log(groups);
            // return groups;
            let str = ``;
            // let n = 97;
            // for (const group of groups) {
            //     let char = String.fromCharCode(n);
            //     if (n > 122) continue;
            //     n++;
            //     str = `
            //     ${str}
            //     :regional_indicator_${char}: ${group.name}`;
            // }
            let i = 1;
            for (const group of groups) {
                str = `
                ${str}
                ${emojies[i]} - ${group.name}`;
                i++
            }
            if (!str) str = `\u200b`;
            const groupsEmbed = {
                title: "Which groups would you like to include?",
                description: str,
                fields: [{
                    name: `Chosen Groups`,
                    value: `\`\`\`
                    
                    \`\`\``,
                    inline: false,
                }],
                footer: {
                    text: `Guild ID: ${interaction.guild.id}`,
                },
            }
            const actGroups = new MessageActionRow()
                .addComponents(buttons.get(`addGroup`))
                .addComponents(buttons.get(`finishGroups`));
            const msg = await user.send({ embeds: [groupsEmbed], components: [actGroups] });
            for (let n = 1; n < i; n++) {
                msg.react(emojies[n]);
            }
            // const reaction = getReaction(msg, i);
            // console.log(reaction);
            const filter = (reaction, user) => true;
            const collector = msg.createReactionCollector({ filter });
            collector.on(`collect`, (reaction, user) => {
                console.log(`reaction`);
                console.log(reaction);
                console.log(`user`);
                console.log(user);
            });
            collector.on(`end`, collected => {
                console.log(`collected`);
                console.log(collected);
            });
        }

        // const date = new Date(str[0],str[1],str[2])

        // console.log(event);
        // await interaction.reply('Loading...', { ephemeral: true })
        // interaction.deleteReply();
        // const channel = interaction.channel;
    },
};