const { SlashCommandBuilder, Embed } = require('@discordjs/builders');
const { MessageEmbed, MessageButton, MessageActionRow, DiscordAPIError } = require("discord.js");
const utility = require('../utility');
const emojies = require('../utilities/emojies.js');
const { cancelable, CancelablePromise } = require('cancelable-promise');

const formatFail = {
    name: "Format Unreadable",
    value: "\`\`\`We were unable to read your formatting. Please try again.\`\`\`",
    inline: false
}

const timeoutEmbed = {
    title: "Session Timed Out",
    description: "\`\`\`You took longer than 15 minutes to respond and so this session has been closed.\`\`\`",
    fields: []
}

const backButton = new MessageButton()
    .setCustomId(`back`)
    .setLabel("BACK")
    .setStyle('SECONDARY');
const cancelButton = new MessageButton()
    .setCustomId(`cancel`)
    .setLabel("CANCEL")
    .setStyle('DANGER');
const nextButton = new MessageButton()
    .setCustomId(`next`)
    .setLabel("NEXT")
    .setStyle('PRIMARY');
const finishButton = new MessageButton()
    .setCustomId(`done`)
    .setLabel(`DONE`)
    .setStyle(`SUCCESS`);

const beginRow = new MessageActionRow()
    .addComponents(cancelButton)
    .addComponents(nextButton);

const standRow = new MessageActionRow()
    .addComponents(backButton)
    .addComponents(cancelButton)
    .addComponents(nextButton);

const lastRow = new MessageActionRow()
    .addComponents(backButton)
    .addComponents(cancelButton)
    .addComponents(finishButton);

module.exports = {
    data: new SlashCommandBuilder()
        .setName("event")
        .setDescription('Create an event.'),
    async execute(interaction) {
        const user = interaction.user;
        const channel = interaction.channel;
        const buttons = interaction.client.buttons;

        const finalEvent = {
            title: `Test Session`,
            description: `This is just a test. Please ignore.`,
            timestamp: new Date(),
            fields: [],
            image: { url: `https://i.imgur.com/U8ckyoI.png` },
        };
        const actRow = new MessageActionRow()
            .addComponents(buttons.get(`attending`))
            .addComponents(buttons.get(`sitting`))
            .addComponents(buttons.get(`unavailable`));

        // interaction.guild.roles.fetch() //.then(roles => console.log(roles.values()))
        //     .then(roles => roles.forEach(role => {
        //         console.log(role.name);
        //         console.log(role.id);
        //     }));
        // await interaction.reply({ content: `${user.username} is creating an event...` });
        let dateTime = {
            year: new Date().getFullYear(),
            month: new Date().getMonth(),
            day: new Date().getDate(),
            hour: new Date().getHours(),
            minute: new Date().getMinutes()
        };
        let offset = 0;
        let index = -1;
        let currentStep;
        const groups = client.databases.groups.values();
        let stringGroups = ``;
        const groupList = {}
        let numGroups = 1;
        for (const group of groups) {
            stringGroups = `
            ${stringGroups}
            ${emojies[numGroups]} - ${group.name}`;
            groupList[emojies[numGroups]] = group;
            numGroups++
        }
        if (!stringGroups) stringGroups = `\u200b`;
        const groupsArr = [];
        const stepsObj = {};
        let test = false;

        const stringMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        const stepsArr = [{
            name: `getOffset`,
            embed() {
                return {
                    title: `UTC Time: ${utility.fix(new Date().getUTCHours())}:${utility.fix(new Date().getMinutes())} on ${new Date().getUTCDate()} ${stringMonths[new Date().getUTCMonth()]}`,
                    description: `\`\`\`First, let's figure out your UTC offset. How many hours are you ahead or behind of this time? Use negative numbers for being behind UTC.\n\nNote: you can write it as a decimal (ex. 1.5) for odd timezones.\`\`\``,
                    fields: [{
                        name: `Current Offset: ${offset} Hour(s)`,
                        value: `\`\`\`You can change this value by typing in a new value below.\nOtherwise press NEXT to proceed.\`\`\``,
                        inline: false
                    }]
                }
            },
            actions: beginRow,
            func: function(content) {
                console.log(`Setting offset.`)
                if (/^[-+]*[0-9]+.*[0-9]*?$/.test(content)) {
                    offset = parseFloat(content);
                } else {
                    offsetEmbed.fields.push(formatFail);
                }
                console.log(offset);
            }
        }, {
            name: `getTitle`,
            embed() {
                return {
                    title: "Title",
                    description: "Please enter the title of the event.",
                    fields: [{
                        name: `Current Title`,
                        value: `\`\`\`${finalEvent.title}\`\`\`\n\`\`\`You can change this value by typing in a new value below.\nOtherwise press NEXT to proceed.\`\`\``,
                        inline: false
                    }]
                }
            },
            actions: standRow,
            func: function(content) {
                console.log(`Setting title.`)
                finalEvent.title = content;
                console.log(finalEvent.title);
            }
        }, {
            name: `getDescription`,
            embed() {
                return {
                    title: "Description",
                    description: `Please enter any description of the event if there is one. Otherwise, write "none".`,
                    fields: [{
                        name: `Current Description`,
                        value: `\`\`\`${finalEvent.description}\`\`\`\n\`\`\`You can change this value by typing in a new value below.\nOtherwise press NEXT to proceed.\`\`\``,
                        inline: false
                    }]
                }
            },
            actions: standRow,
            func: function(content) {
                console.log(`Setting description.`)
                if (content.match(/^[A-Za-z]+/)[0].toLowerCase() == "none") content = `\u200b`;
                finalEvent.description = content;
                console.log(offset);
            }
        }, {
            name: `getDate`,
            embed() {
                return {
                    title: "Date",
                    description: `Please enter the date of the event.
                    
                    Examples:
                    January 24 2022
                    01/24/2022
                    24 Jan 2022
                    2022-01-24`,
                    fields: [{
                        name: `Current Date: ${dateTime.day} ${stringMonths[dateTime.month]}, ${dateTime.year}`,
                        value: `\`\`\`You can change this value by typing in a new value below.\nOtherwise press NEXT to proceed.\`\`\``,
                        inline: false
                    }]
                }
            },
            actions: standRow,
            func: function(content) {
                console.log(`Setting date.`)
                const temp = utility.getDate(content);
                if (temp) {
                    dateTime.year = temp.year;
                    dateTime.month = temp.month;
                    dateTime.day = temp.day;
                } else {
                    dateEmbed.fields.push(formatFail)
                };
                console.log(offset);
            }
        }, {
            name: `getTime`,
            embed() {
                return {
                    title: "Time",
                    description: `Please enter the time you would like the event to start.

                    Examples:
                    14:45
                    1445
                    2:45pm
                    245pm`,
                    fields: [{
                        name: `Set Time`,
                        value: `<t:${new Date(dateTime.year,dateTime.month,dateTime.day,dateTime.hour,dateTime.minute).getTime() / 1000}:t>\n\nYou can still change this value by typing in a new value below.\nOtherwise click NEXT to proceed.`,
                        inline: false
                    }]
                }
            },
            actions: standRow,
            func: function(content) {
                console.log(`Setting time.`)
                const temp = utility.getTime(content);
                if (temp) {
                    dateTime.hour = temp.hour;
                    dateTime.minute = temp.minute;
                } else {
                    timeEmbed.fields.push(formatFail)
                };
                console.log(offset);
            }
        }, {
            name: `getGroups`,
            embed() {
                return {
                    title: "Which groups would you like to include?",
                    description: `${stringGroups}`,
                    fields: [{
                        name: `Chosen Groups`,
                        value: `${getGroupNames()}`,
                        inline: false,
                    }],
                    footer: {
                        text: `Guild ID: ${interaction.guild.id}`,
                    },
                }
            },
            actions: standRow,
            react: async function() {
                console.log(`Setting groups.`)
                client.reactionRoles.set(message.id, message);
                client.on('messageReactionAdd', onGroupReactionAdd);
                client.on('messageReactionRemove', onGroupReactionRemove);
                for (let n = 1; n < numGroups; n++) {
                    if (test) message.react(emojies[n]);
                }
            }
        }, {
            name: `showEvent`,
            embed() {
                const eventEmbed = {
                    title: `Current Settings`,
                    description: `These are all of the settings that will go into the posted event. If you would like to change any of them, press the BACK button to go back to the setting or select one of the reactions below to jump straight to its corresponding step.`,
                    fields: []
                }
                for (let i = 0; i < stepsArr.length - 1; i++) {
                    stepsObj[emojies[i + 1]] = i + 1;
                    stepsArr[i].embed().fields.forEach(field => {
                        field.name = `${emojies[i + 1]} - ${field.name}`;
                        eventEmbed.fields.push(field);
                    });
                }
                console.log(stepsObj);
                return eventEmbed;
            },
            actions: lastRow,
            react: async function(prom) {
                client.reactionRoles.set(message.id, message);
                const reactionEvent = (reaction, user) => {
                    if (reaction.message.id == message.id && user.id != client.user.id) {
                        console.log(`Reaction pressed.`);
                        prom.cancel();
                        index = stepsObj[reaction._emoji.name] - 1;
                        console.log(index);
                        message.reactions.removeAll();
                        client.removeListener('messageReactionAdd', reactionEvent);
                        generic(stepsArr[index]);
                    }
                }
                client.on('messageReactionAdd', reactionEvent);
                for (let n = 1; n < stepsArr.length; n++) {
                    if (test) message.react(emojies[n]);
                }
            },
            final: true
        }];
        const msgFilter = msg => interaction.user.id == msg.author.id;
        const cmpFilter = act => true;
        const message = await interaction.reply({
            embeds: [{
                title: `Creating an Event`,
                description: `This will walk you through the creation of a new event. Please press NEXT when you are ready to proceed.`
            }],
            components: [beginRow],
            fetchReply: true
        });
        console.log(message);
        message.awaitMessageComponent({ cmpFilter, max: 1, time: 900000, errors: [`time`] }).then(button => selectStep(button))
            .catch(error => {
                console.log(`An error has occured while awaiting a button.`);
                console.log(error);
                timeout();
            });

        async function selectStep(button) {
            console.log(index);
            switch (button.customId) {
                case 'next':
                    console.log(`Proceeding`);
                    index++;
                    console.log(index);
                    console.log(stepsArr[index]);
                    generic(stepsArr[index], button);
                    break;
                case 'back':
                    console.log(`Going Back`);
                    index--;
                    console.log(index);
                    console.log(stepsArr[index]);
                    generic(stepsArr[index], button);
                    break;
                case 'cancel':
                    console.log(`Cancelling`);
                    message.delete();
                    break;
                case 'done':
                    console.log(`Finished`);
                    message.delete();
                    postEvent();
                    break;
                default:
                    console.log(`Repeating`);
                    console.log(index);
                    console.log(stepsArr[index]);
                    generic(stepsArr[index], button);
                    break;
            }
        }

        const onGroupReactionAdd = (reaction, user) => {
            if (reaction.message.id == message.id && user.id != client.user.id) {
                try {
                    const ind = groupsArr.indexOf(groupList[reaction._emoji.name]);
                    if (ind == -1) groupsArr.push(groupList[reaction._emoji.name]);
                    updateGroups();
                } catch (error) {
                    console.log(error);
                }
            }
        }

        const onGroupReactionRemove = (reaction, user) => {
            if (reaction.message.id == message.id && user.id != client.user.id) {
                try {
                    const ind = groupsArr.indexOf(groupList[reaction._emoji.name]);
                    if (ind != -1) groupsArr.splice(ind, 1);
                    updateGroups();
                } catch (error) {
                    console.log(error);
                }
            }
        }

        function updateGroups() {
            const names = getGroupNames();
            const groupsEmbed = currentStep.embed();
            groupsEmbed.fields[0].value = names;
            message.edit({ embeds: [groupsEmbed], components: [currentStep.actions] });
        }

        function getGroupNames() {
            let str = `\`\`\``;
            groupsArr.sort(function(a, b) {
                if (a.name < b.name) return -1;
                if (a.name > b.name) return 1;
                return 0;
            })
            for (const group of groupsArr) {
                str = `${str}\n${group.name}`
            }
            str = `${str}\n\`\`\``
            return str;
        }

        async function generic(obj, button) {
            currentStep = obj;
            test = true;
            console.log(obj.name);
            console.log(button);
            if (button) {
                await button.update({ embeds: [obj.embed()], components: [obj.actions] });
            } else {
                await message.edit({ embeds: [obj.embed()], components: [obj.actions] });
            }
            const fail = obj.embed().fields.indexOf(formatFail);
            if (fail != -1) obj.embed().fields.splice(fail, 1);
            // try {
            let resp;
            let step;
            let react;
            try {
                step = cancelable(message.awaitMessageComponent({ cmpFilter, max: 1, time: 900000, errors: [`time`] }));
                console.log(`Waiting for next step.`);
                step.then(button => {
                    if (resp) resp.cancel();
                    if (react) {
                        react.cancel();
                        test = false;
                        message.reactions.removeAll();
                        client.removeListener('messageReactionAdd', onGroupReactionAdd);
                        client.removeListener('messageReactionRemove', onGroupReactionRemove);
                    }
                    selectStep(button);
                });
                step.catch(error => {
                    console.log(`An error has occured while awaiting a button.`);
                    console.log(error);
                    timeout();
                });
            } catch (error) {
                console.log(`An breaking error has occured while awaiting a button.`);
                console.log(error);
            }
            if (obj.func) {
                resp = cancelable(channel.awaitMessages({ msgFilter, max: 1, time: 900000, errors: [`time`] }));
                console.log(`Waiting for response.`);
                resp.then(responseMap => {
                    console.log(`Got a response.`);
                    let response = responseMap.at(0);
                    console.log(response);
                    obj.func(response.content);
                    response.delete();
                    step.cancel();
                    generic(obj);
                });
                resp.catch(error => {
                    console.log(`An error has occured while awaiting a message.`);
                    console.log(error);
                    timeout();
                });
            }
            if (obj.react) {
                react = cancelable(obj.react(step));
                console.log(react);
            }
            // } catch (error) {
            //     console.log(error);
            //     timeout();
            // }
        }

        async function timeout() {
            message.edit({ embeds: [timeoutEmbed], components: [] });
        }

        async function postEvent() {
            let dateForm = new Date(dateTime.year, dateTime.month, dateTime.day, dateTime.hour - (offset * 60), dateTime.minute).getTime() / 1000;
            let str = ``
            let content = ``
            groupsArr.forEach(group => {
                console.log(group);
                content = `${content} ${group.name}`
                group.players.forEach(player => {
                    str = `${str}\n<@!${player}>`
                })
            })
            if (!str) str = `\u200b`;
            finalEvent.fields = [{
                name: `When:`,
                value: `<t:${dateForm}:F>\n<t:${dateForm}:R>`,
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
            }]
            channel.send({ content: content, embeds: [finalEvent], components: [actRow] });
        }
    }
};