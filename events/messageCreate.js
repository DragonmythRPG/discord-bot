module.exports = {
    name: `messageCreate`,
    async execute(message) {
        if (message.channelId != `746169387450630144` || message.attachments.size == 0) return;
        let content = message.content
        if (!content || content.length > 100) content = `${message.author.username}'s Post`;
        await message.startThread({
            name: content,
            autoArchiveDuration: 4320,
            reason: `Testing out Thread Creation`,
        })
    }
}