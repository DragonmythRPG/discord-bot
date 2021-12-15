const { SlashCommandBuilder, Embed } = require('@discordjs/builders');
const { MessageEmbed, MessageButton, MessageActionRow } = require("discord.js");

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

let dateFormatList = {
    name: "Date Formats:",
    value: ""
};
dateFormats.forEach(format => {
    dateFormatList.value = `${dateFormatList.value}
    ${format.name}`
})

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
        const filter = msg => interaction.user.id == msg.author.id;
        const user = interaction.user;
        const channel = await user.createDM();
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
        let date = { year: 2021, month: 11, day: 15 }
        console.log(date);
        if (!date) return false;
        // let time = await getTime();
        let time = { hour: 15, minute: 0 }
        console.log(time);
        if (!time) return false;
        // let offset = await getOffset();
        let offset = 2;
        console.log(offset);
        let group = await interaction.guild.roles.fetch(`891262046883151882`);
        let str = ``;
        group.members.forEach(member => {
            str = `${str}<@!${member.id}>
            `;
        });
        console.log(str);
        // description = str;
        let dateTime = new Date(date.year, date.month, date.day, time.hour - offset, time.minute).getTime() / 1000
        let attending = `\u200b`
        const actRow = new MessageActionRow()
            .addComponents(new MessageButton()
                .setEmoji(`212e30e47232be03033a87dc58edaa95`))

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
                name: `Waiting for Selection`,
                value: str,
                inline: false,
            }, {
                name: `Attending`,
                value: `\`\`\`
                


                \`\`\``,
                inline: true,
            }, {
                name: `Sitting Out`,
                value: `\`\`\`
                
                
                
                \`\`\``,
                inline: true,
            }, {
                name: `Unavailable`,
                value: `\`\`\`
                
                
                
                \`\`\``,
                inline: true,
            }],
            image: {
                url: `https://imgur.com/a/DEk1W1T`,
                width: 1200,
            },
            components: [actRow],
            // footer: `\u280b`.repeat(500),
        };
        console.log(finalEvent);
        prom.then(msg => msg.delete());
        // user.send({ embeds: [finalEvent] });
        const message = await interaction.channel.send({ embeds: [finalEvent] });
        console.log(message);

        async function getResponse() {
            const response = await channel.awaitMessages({ filter, max: 1, time: 900000 });
            if (response.at(0)) return response.at(0).content;
            user.send({ embeds: [timeout] });
            return false;
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

        async function getDate(bool) {
            if (bool) { user.send({ embeds: [formatFail] }); } else { user.send({ embeds: [dateEmbed] }); }
            const response = await getResponse();
            if (!response) return false;
            let formatted;
            dateFormats.forEach(format => {
                if (format.reg.test(response)) formatted = format;
            });
            console.log(formatted);
            if (!formatted) return getDate(true);
            let final = {}
            const a = formatted.name.split("-");
            const b = response.split(/[-,. \/]+/);
            console.log(a);
            console.log(b);
            for (let i = 0; i < a.length; i++) {
                let str = a[i];
                switch (true) {
                    case /^d+/.test(str):
                        final.day = parseInt(b[i]);
                        break;
                    case /^m+/.test(str):
                        final.month = parseInt(b[i]);
                        break;
                    case /^y+/.test(str):
                        final.year = parseInt(b[i]);
                        break;
                    case /^M+/.test(str):
                        final.month = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"].indexOf(b[i].substring(0, 3).toLowerCase());
                        break;
                }
            }
            return final;
        }

        async function getTime(bool) {
            if (bool) { user.send({ embeds: [formatFail] }); } else { user.send({ embeds: [timeEmbed] }); }
            const response = await getResponse();
            if (!response) return false;
            let formatted;
            timeFormats.forEach(format => {
                if (format.reg.test(response)) formatted = true;
            });
            if (!formatted) return getTime(true);
            let d = response.match(/[A-Za-z]{2}/);
            let pm = 0;
            if (d && d[0].toLowerCase() == "pm") pm = 12;
            // const c = response.match(/[0-9]{2}[: ]*[0-9]{2}/)
            // const pmReg = ;
            let t = response.replaceAll(/[A-Za-z: ]/ig, "");
            console.log(d);
            console.log(t);
            while (t.length < 4) {
                t = `0${t}`
            }
            let final = {
                hour: parseInt(t.substring(0, 2)) + pm,
                minute: parseInt(t.substring(2, 4))
            };
            return final;
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

        // const date = new Date(str[0],str[1],str[2])

        // console.log(event);
        // await interaction.reply('Loading...', { ephemeral: true })
        // interaction.deleteReply();
        // const channel = interaction.channel;
    },
};