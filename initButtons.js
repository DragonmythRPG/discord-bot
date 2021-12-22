const { Collection } = require("discord.js");
const fs = require("fs")

const buttons = new Collection();
const buttonFiles = fs.readdirSync("./buttons").filter(file => file.endsWith(".js"));

function registerButtons() {
    for (const buttonFile of buttonFiles) {
        const button = require(`./buttons/${buttonFile}`);
        buttons.set(button.customId, button);
    }
    client.buttons = buttons;
}

module.exports = { registerButtons }