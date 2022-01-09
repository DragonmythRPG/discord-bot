const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow } = require("discord.js");
const userDatabase = require("../initDatabase.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('profile')
        .setDescription('View the profile of yourself or (by mentioning them) of someone else.')
        .addUserOption(option =>
            option.setName(`user`)
            .setDescription(`Choose the user you want to view. Defaults to yourself.`)
            .setRequired(false)),
    async execute(interaction) {
        console.log(interaction);
        const buttons = interaction.client.buttons;
        const member = (interaction.options.getUser(`user`)) ? interaction.options.getUser(`user`) : interaction.user;
        await member.fetch();
        const database = interaction.client.databases.users;
        let data = database.get(member.id);
        if (!data) data = database.set(member.id, { userID: member.id, userName: member.username, userXP: 0 });
        // userDatabase.User.upsert(client.databases.users.get(member.id));
        const embed = {
            title: `Profile of ${member.username}`,
            desription: `Testing the profiles`,
            thumbnail: {
                url: member.avatarURL()
            },
            fields: [{
                name: `Test`,
                value: `Testing`,
                inline: true,
            }, {
                name: `Test`,
                value: `Testing`,
                inline: true,
            }, {
                name: `Test`,
                value: `Testing`,
                inline: true,
            }, ],
            image: {
                url: member.bannerURL()
            },
        }
        const actRow = new MessageActionRow()
            .addComponents(buttons.get(`editProfile`));
        const msg = await interaction.reply({ embeds: [embed], components: [actRow], fetchReply: true })
        console.log(msg);
    },
};