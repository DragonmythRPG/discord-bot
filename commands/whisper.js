const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('whisper')
        .setDescription('Only the users you select can hear you.')
        .addUserOption(option => option.setName('target1').setDescription('Select a user').setRequired(true))
        .addUserOption(option => option.setName('target2').setDescription('Select a user'))
        .addUserOption(option => option.setName('target3').setDescription('Select a user'))
        .addUserOption(option => option.setName('target4').setDescription('Select a user'))
        .addUserOption(option => option.setName('target5').setDescription('Select a user'))
        .addUserOption(option => option.setName('target6').setDescription('Select a user')),
    async execute(interaction) {
        // let arr = [];
        // for (let i = 1; i < 7; i++) {
        //     arr.push(interaction.options.getUser(`target${i}`))
        // }
        // console.log(arr);
        const user1 = interaction.options.getUser('target1');
        // arr.forEach(user => {
        interaction.reply(`Hey, ${user1}, ${interaction.user} knows who you are.`);
        // })
    },
}