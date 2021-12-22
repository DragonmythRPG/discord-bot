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
    },
    getDate,
    getTime,
}

function getDate(response) {
    const order = "dd-mm"

    const dateFormats = [{
        name: "yyyy-mm-dd",
        reg: /^[0-9]{4}[-,. \/]+[0-9]{2}[-,. \/]+[0-9]{2}?$/,
    }, {
        name: `${order}-yyyy`,
        reg: /^[0-9]{2}[-,. \/]+[0-9]{2}[-,. \/]+[0-9]{4}?$/,
    }, {
        name: "MMM-dd-yyyy",
        reg: /^[A-Za-z]{3}[-,. \/]+[0-9]{2}[-,. \/]+[0-9]{4}?$/,
    }, {
        name: "dd-MMM-yyyy",
        reg: /^[0-9]{2}[-,. \/]+[A-Za-z]{3}[-,. \/]+[0-9]{4}?$/,
    }, {
        name: "MMM-dd",
        reg: /^[A-Za-z]{3}[-,. \/]+[0-9]{2}?$/,
    }, {
        name: "dd-MMM",
        reg: /^[0-9]{2}[-,. \/]+[A-Za-z]{3}?$/,
    }];

    let formatted;
    dateFormats.forEach(format => {
        if (format.reg.test(response)) formatted = format;
    });
    if (!formatted) return getDate(true);
    let final = {}
    const a = formatted.name.split("-");
    const b = response.split(/[-,. \/]+/);
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

function getTime(response) {
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

    let formatted;
    timeFormats.forEach(format => {
        if (format.reg.test(response)) formatted = true;
    });
    if (!formatted) return getTime(true);
    let d = response.match(/[A-Za-z]{2}/);
    let pm = 0;
    if (d && d[0].toLowerCase() == "pm") pm = 12;
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