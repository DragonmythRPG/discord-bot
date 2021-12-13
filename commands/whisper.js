const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');

// const data = new SlashCommandBuilder
//     .setName('whisper')
//     .setDescription('Only the users you select can hear you.')


module.exports = {
    data: new SlashCommandBuilder()
        .setName('whisper')
        .setDescription('Only the users you select can hear you.')
        // .addUserOption(option => option.setName('target1').setDescription('Select a user').setRequired(true))
        // .addUserOption(option => option.setName('target2').setDescription('Select a user'))
        // .addUserOption(option => option.setName('target3').setDescription('Select a user'))
        // .addUserOption(option => option.setName('target4').setDescription('Select a user'))
        // .addUserOption(option => option.setName('target5').setDescription('Select a user'))
        // .addUserOption(option => option.setName('target6').setDescription('Select a user'))
        .addSubcommand(subcommand =>
            subcommand
            .setName("add")
            .setDescription("Add users or roles to the whisper list.")),
    async execute(interaction) {
        // const whisperFiles = fs.readdirSync("./whisper").filter(file => file.endsWith(".js"));
        // for (const file of whisperFiles) {
        //     const subcommand = require(`./commands/${file}`);
        //     client.commands.set(subcommand.data.name, subcommand);
        // }

        // let sub;
        // help.data.addStringOption(subcommand => {
        //     subcommand
        //         .setName("command")
        //         .setDescription("The command you need help with.");
        //     sub = subcommand;
        //     return subcommand;
        // })
        // for (const file of whisperFiles) {
        //     const command = require(`./commands/${file}`);
        //     sub.addChoice(command.data.name, command.data.description);
        // }

        let subcommand = interaction.options.getSubcommand() == "add";
        let arr = [];
        for (let i = 1; i < 7; i++) {
            let user = interaction.options.getUser(`target${i}`)
            if (user) arr.push(user)
        }
        console.log(arr);
        console.log(interaction);
        const user1 = interaction.options.getUser('target1');
        arr.forEach(user => {
            console.log(`To ${user.username}: ${interaction.user.username} says, "${interaction}"`);
        })
    },
}