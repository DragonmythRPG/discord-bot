module.exports = {
    name: 'interactionCreate',
    async execute(interaction) {
        const client = interaction.client;
        console.log(`${interaction.user.tag} in #${interaction.channel.name} triggered an interaction.`);
        let type;
        let name;
        if (interaction.isButton()) type = `buttons`, name = `customId`;
        if (interaction.isCommand()) type = `commands`, name = `commandName`;
        if (!type || !name) return;
        const action = client[type].get(interaction[name]);
        if (!action) return;
        try {
            await action.execute(interaction);
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    },
};