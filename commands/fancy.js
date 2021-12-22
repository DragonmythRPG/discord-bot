const { SlashCommandBuilder } = require('@discordjs/builders');

const scrolls = {
    a: `<:sc_a:780245173409284126>`,
    b: `<:sc_b:780245219374268437>`,
    c: `<:sc_c:780245250970877982>`,
    d: `<:sc_d:780245339306983444>`,
    e: `<:sc_e:780245388867010561>`,
    f: `<:sc_f:780245421565673482>`,
    g: `<:sc_g:780245452574556170>`,
    h: `<:sc_h:780245481766649857>`,
    i: `<:sc_i:780245515941183550>`,
    j: `<:sc_j:780245542529400853>`,
    k: `<:sc_k:780245567216549888>`,
    l: `<:sc_l:780245595289813012>`,
    m: `<:sc_m:780246328256364555>`,
    n: `<:sc_n:780246357498658847>`,
    o: `<:sc_o:780246383454060554>`,
    p: `<:sc_p:780246409337110548>`,
    q: `<:sc_q:780246434116534272>`,
    r: `<:sc_r:780246458145177621>`,
    s: `<:sc_s:780246479772057681>`,
    t: `<:sc_t:780246503599243295>`,
    u: `<:sc_u:780246525170810910>`,
    v: `<:sc_v:780246548852113448>`,
    w: `<:sc_w:780246575304671272>`,
    x: `<:sc_x:780246597551259658>`,
    y: `<:sc_y:780246619706359808>`,
    z: `<:sc_z:780246639499280414>`,
    start: `<:sc__start:780164742223626280>`,
    end: `<:sc__end:780164771978412072>`,
    space: `<:sc__space:780245075002916885>`,
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('fancy')
        .setDescription('Write fancy!')
        .addStringOption(option =>
            option.setName(`msg`)
            .setDescription(`What message do you want to send?`)
            .setRequired(true)),
    async execute(interaction) {
        await interaction.reply("Loading...");
        interaction.deleteReply();

        const msg = interaction.options.getString(`msg`);
        const msgArr = msg.toLowerCase().split(``);
        const newMsg = [scrolls.start];
        let i = 0;
        msgArr.forEach(char => {
            let emoji = scrolls[char];
            // console.log(msg.charCodeAt(i))
            // i++
            if (char == " ") emoji = scrolls.space;
            if (emoji) {
                console.log(emoji);
                newMsg.push(emoji);
            } else {
                console.log(char);
                newMsg.push(char)
            }
        });
        newMsg.push(scrolls.end);


        interaction.channel.send(newMsg.join(``));
    },
};