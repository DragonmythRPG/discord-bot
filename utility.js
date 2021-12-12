module.exports = {
    test(str) {
        console.log(str);
    },
    async collect(interaction) {
        const filter = m => {
            console.log(m);
            m = interaction.user.id == m.author.id;
            console.log(m);
            return m;
        }
        const collector = interaction.channel.createMessageCollector({ filter, time: 15000, max: 1 });

        let test;
        collector.on("collect", m => test = m.content)

        collector.on('end', collected => {
            console.log(`Collected ${collected.size} items`);
        });
    }
}