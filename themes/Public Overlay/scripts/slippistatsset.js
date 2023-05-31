var piio = new PiioConnector("playerstatsset");
const average = array => array.reduce((a, b) => a + b) / array.length;
var inanimation = false;
var inchanging = false;
var waitforws = false;
var players;
var datatest;
var time1 = performance.now();

var piioports = [];
//Game Stats
var character1 = [];
var character2 = [];
var charactercolor1 = [];
var charactercolor2 = [];
var stages = [];
var timer = [];
var stocks1 = [];
var stocks2 = [];
var stocksleft1 = [];
var stocksleft2 = [];
var dataport1 = [];
var dataport2 = [];
var deaths = [[], []];

//Punish Game stats
var openingsperkill = [];
var damageperopenings = [];
var conversionsuccess = []; //noch nicht verarbeitet
var killmove = [];

//Defense Game
var groundtechratio = []; //noch nicht verarbeitet
var groundTechSuccess = [];
var groundTechOverall = [];
var walltechratio = []; //noch nicht verarbeitet
var wallTechSuccess = [];
var wallTechOverall = [];
var counterhit = []; //noch nicht verarbeitet
var counterhitsuccess = [];
var counterhittotal = [];
var latestdeath = []; //noch nicht verarbeitet

//Neutral Game
var conversionmove = [];
var neutralwins = [];
var dashdance = []; //noch nicht verarbeitet
var ledgegrabcount = [];

//Misc
var earliestkill = []; //noch nicht verarbeitet
var avaregekill = []; //noch nicht verarbeitet
var ipm = [];
var damagepergame = [];


var conversionSuccessTotal = [];
var conversionTotal = [];


var stats = new SlippiStatsConnector();

async function resolveStats(data) {
    console.log(data);
    if (waitforws) {
        computestats(data, function () {
            for (var i = 0; i < deaths.length; i++) {
                deaths[i].sort((a, b) => a - b);
            }
            insertStats()

        })
            .then(console.log("stats inserted"))
            .then(function () {
                setTimeout(function () {
                    slippistatsloaded();

                }, (performance.now() - time1) < 7000 ? (7000 - performance.now() - time1) : 0);
            })
    }
}
piio.on("scoreboard", (data) => {
    if (!waitforws) {
        waitforws = true;
        sendMessage(piio.getScore(1) + piio.getScore(2));
        jQuery('#phase').text(data.fields.round.value);

        while ($('#phase').width() > 534) {
            var fontSize = parseInt(jQuery('#phase').css("font-size"));
            fontSize = fontSize - 1 + "px";
            jQuery('#phase').css({ 'font-size': fontSize });
        }
        for (var i = 0, y = 1; i < 2; i++, y++) {
            jQuery("#country" + y).css('background-image', 'url(assets/country/' + piio.getPlayer(y, 0).country + '.svg)');
            piioports[i] = piio.getPort(i + 1);
            jQuery('#playername' + y).text(piio.getPlayer(y, 0).name);
            jQuery('#playerpronoun' + y).text(piio.getPlayer(y, 0).pronoun);
            jQuery('#score' + y).text(piio.getScore(y));
            jQuery('#playerteam' + y).text((piio.getPlayer(y, 0).team.length > 0) ? piio.cache.team[piio.getPlayer(y, 0).team].name : '');

            while ($('#playerfield' + y).width() > 494) {
                var fontSize = parseInt(jQuery('#playerfield' + y).css("font-size"));
                fontSize = fontSize - 1 + "px";
                jQuery('#playerfield' + y).css({ 'font-size': fontSize });
            }
        }
        setTimeout(function () {
            for (var i = 0, y = 1; i < 2; i++, y++) {
                $('#playerteam' + y).css({ top: $('#playerteam' + y).height() * -1 });
            }
            $('#playerfield1').css({ left: $('#playerfield1').width() * -1 });
            $('#playerfield2').css({ right: $('#playerfield2').width() * -1 });
            jQuery('#headerdiv').animate({ "left": "99", "top": "498", "width": "1722", "height": "84" }, 400, function () {
                jQuery('.country').animate({ "opacity": 1 }, 500);
                $('#playerfield1').animate({ "left": "0px", "opacity": 1 }, 500);
                $('#playerfield2').animate({ "right": "0px", "opacity": 1 }, 500);
                $('#phase').animate({ "opacity": 1 }, 500);
                time1 = performance.now();
            });
        }, 600);
    }
});



async function computestats(data, callback) {
    var playerslippiindex1;
    var playerslippiindex2;
    datatest = data;
    var inputs = [];
    const games = piio.getScore(1) + piio.getScore(2);
    // Check if Slippi Port == PIIO Port
    if (data.settings[data.settings.length - 1].players[0].port == piioports[0]) {
        playerslippiport1 = data.settings[games - 1].players[0].port;
        playerslippiindex1 = data.settings[games - 1].players[0].playerIndex;
        playerslippiport2 = data.settings[games - 1].players[1].port;
        playerslippiindex2 = data.settings[games - 1].players[1].playerIndex;
    } else {
        playerslippiport1 = data.settings[games - 1].players[1].port;
        playerslippiindex1 = data.settings[games - 1].players[1].playerIndex;
        playerslippiport2 = data.settings[games - 1].players[0].port;
        playerslippiindex2 = data.settings[games - 1].players[0].playerIndex;
    }
    console.log('PlayerslippiPort')
    for (var a = 0; a < games; a++) {
        for (let death of data.stats[a].stocks) {
            console.log(death);
            if (playerslippiindex1 == death.playerIndex) {
                if (typeof death.endPercent === 'number') {
                    deaths[0].push(death.endPercent);
                }
            } else if (playerslippiindex2 == death.playerIndex) {
                if (typeof death.endPercent === 'number') {
                    deaths[1].push(death.endPercent);
                }
            }
        }
    }
    for (var i = 0; i < 2; i++) {

        var inputs = 0;
        var minutes = 0;
        var damage = 0;
        var openings = 0;
        var kills = 0;
        var dashdances = 0
        conversionSuccessTotal[i] = 0;
        conversionTotal[i] = 0;
        wallTechOverall[i] = 0;
        wallTechSuccess[i] = 0;
        groundTechOverall[i] = 0;
        groundTechSuccess[i] = 0;
        counterhitsuccess[i] = 0;
        counterhittotal[i] = 0;
        groundtechratio[i] = 0;

        neutralwins[i] = 0;
        ledgegrabcount[i] = 0;
        var conversionmovetest = [];
        for (var a = 0; a < games; a++) {
            if (playerslippiport1 == data.settings[a].players[0].port) {
                for (var z = 0; z < data.stats[a].conversions.length; z++) {
                    if (data.stats[a].conversions[z].lastHitBy == data.settings[a].players[i].playerIndex) {
                        if (data.stats[a].conversions[z].moves[0] != undefined) {
                            conversionmovetest[conversionmovetest.length] = stats.moveId(data.stats[a].conversions[z].moves[0].moveId);
                            console.log(data.stats[a].conversions[z].moves[0].moveId);
                        }
                    }
                }
            } else {
                for (var z = 0; z < data.stats[a].conversions.length; z++) {
                    if (data.stats[a].conversions[z].lastHitBy == data.settings[a].players[1 - i].playerIndex) {
                        if (data.stats[a].conversions[z].moves[0] != undefined) {
                            conversionmovetest[conversionmovetest.length] = stats.moveId(data.stats[a].conversions[z].moves[0].moveId);
                            console.log(data.stats[a].conversions[z].moves[0].moveId);
                        }
                    }
                }
            }
        }
        var mf = 1;
        var m = 0;
        var item;
        console.log(conversionmovetest)
        if (conversionmovetest.length == 1) {
            item = conversionmovetest[0];
            mf = 1;
        } else {
            const array = await mostoccurent(conversionmovetest);
            mf = array[1];
            item = array[0];

        }
        if (conversionmovetest.length == 0) {
            conversionmove[i] = "---";
        }
        else {
            console.log(conversionmovetest)
            if (i == 0) {
                conversionmove[i] = "(" + mf + "x) " + item;
            } else {
                conversionmove[i] = item + " (" + mf + "x)";
            }
        }

        var killmovetest = [];
        for (var a = 0; a < games; a++) {
            if (playerslippiport1 == data.settings[a].players[0].port) {
                for (var z = 0; z < data.stats[a].conversions.length; z++) {
                    if (data.stats[a].conversions[z].lastHitBy == data.settings[a].players[i].playerIndex && data.stats[a].conversions[z].didKill == true) {

                        killmovetest[killmovetest.length] = stats.moveId(data.stats[a].conversions[z].moves[data.stats[a].conversions[z].moves.length - 1].moveId);

                    }
                }
            } else {
                for (var z = 0; z < data.stats[a].conversions.length; z++) {
                    if (data.stats[a].conversions[z].lastHitBy == data.settings[a].players[1 - i].playerIndex && data.stats[a].conversions[z].didKill == true) {

                        killmovetest[killmovetest.length] = stats.moveId(data.stats[a].conversions[z].moves[data.stats[a].conversions[z].moves.length - 1].moveId);
                    }
                }

            }
        }
        var mf2 = 1;
        var m2 = 0;
        var item2;
        console.log("Killmovetest Player " + i)
        console.log(killmovetest)
        if (killmovetest.length == 0) {
            item2 = "nAn";
            mf2 = 0;
        } else if (killmovetest.length == 1) {
            item2 = killmovetest[0];
            mf2 = 1;
        } else {
            const array = await mostoccurent(killmovetest);
            mf2 = array[1];
            item2 = array[0];
        }
        if (killmovetest.length == 0) {
            killmove[i] = " --- ";
        }
        else {
            if (i == 0) {
                killmove[i] = "(" + mf2 + "x) " + item2;
            } else {
                killmove[i] = item2 + " (" + mf2 + "x)";
            }
        }


        for (var a = 0; a < games; a++) {
            if (playerslippiport1 == data.settings[a].players[0].port) {
                inputs = inputs + data.stats[a].overall[i].digitalInputsPerMinute.count;
                minutes = minutes + data.stats[a].overall[i].digitalInputsPerMinute.total;
                damage = damage + data.stats[a].overall[i].totalDamage;
                openings = openings + data.stats[a].overall[i].openingsPerKill.count;
                kills = kills + data.stats[a].overall[i].openingsPerKill.total;
                dashdances = dashdances + data.stats[a].actionCounts[i].dashDanceCount;
                neutralwins[i] = neutralwins[i] + data.stats[a].overall[i].neutralWinRatio.count;
                ledgegrabcount[i] = ledgegrabcount[i] + data.stats[a].actionCounts[i].ledgegrabCount;
                conversionTotal[i] = conversionTotal[i] + data.stats[a].overall[i].successfulConversions.total;
                conversionSuccessTotal[i] = conversionSuccessTotal[i] + data.stats[a].overall[i].successfulConversions.count;
                wallTechSuccess[i] = wallTechSuccess[i] + data.stats[a].actionCounts[i].wallTechCount.success;
                wallTechOverall[i] = wallTechOverall[i] + data.stats[a].actionCounts[i].wallTechCount.fail + data.stats[a].actionCounts[i].wallTechCount.success;

                groundTechSuccess[i] = groundTechSuccess[i] + data.stats[a].actionCounts[i].groundTechCount.away + data.stats[a].actionCounts[i].groundTechCount.neutral + data.stats[a].actionCounts[i].groundTechCount.in;
                groundTechOverall[i] = groundTechOverall[i] + data.stats[a].actionCounts[i].groundTechCount.fail + data.stats[a].actionCounts[i].groundTechCount.away + data.stats[a].actionCounts[i].groundTechCount.neutral + data.stats[a].actionCounts[i].groundTechCount.in;
                counterhitsuccess[i] = counterhitsuccess[i] + data.stats[a].overall[i].counterHitRatio.count;
                counterhittotal[i] = counterhittotal[i] + data.stats[a].overall[i].counterHitRatio.total;

            } else {
                inputs = inputs + data.stats[a].overall[1 - i].digitalInputsPerMinute.count;
                minutes = minutes + data.stats[a].overall[1 - i].digitalInputsPerMinute.total;
                damage = damage + data.stats[a].overall[1 - i].totalDamage;
                openings = openings + data.stats[a].overall[1 - i].openingsPerKill.count;
                kills = kills + data.stats[a].overall[1 - i].openingsPerKill.total;
                dashdances = dashdances + data.stats[a].actionCounts[1 - i].dashDanceCount;
                neutralwins[i] = neutralwins[i] + data.stats[a].overall[1 - i].neutralWinRatio.count;
                ledgegrabcount[i] = ledgegrabcount[i] + data.stats[a].actionCounts[1 - i].ledgegrabCount;
                conversionTotal[i] = conversionTotal[i] + data.stats[a].overall[1 - i].successfulConversions.total;
                conversionSuccessTotal[i] = conversionSuccessTotal[i] + data.stats[a].overall[1 - i].successfulConversions.count;
                wallTechSuccess[i] = wallTechSuccess[i] + data.stats[a].actionCounts[1 - i].wallTechCount.success;
                wallTechOverall[i] = wallTechOverall[i] + data.stats[a].actionCounts[1 - i].wallTechCount.fail + data.stats[a].actionCounts[1 - i].wallTechCount.success;
                groundTechSuccess[i] = groundTechSuccess[i] + data.stats[a].actionCounts[1 - i].groundTechCount.away + data.stats[a].actionCounts[1 - i].groundTechCount.neutral + data.stats[a].actionCounts[1 - i].groundTechCount.in;
                groundTechOverall[i] = groundTechOverall[i] + data.stats[a].actionCounts[1 - i].groundTechCount.fail + data.stats[a].actionCounts[1 - i].groundTechCount.away + data.stats[a].actionCounts[1 - i].groundTechCount.neutral + data.stats[a].actionCounts[1 - i].groundTechCount.in;
                counterhitsuccess[i] = counterhitsuccess[i] + data.stats[a].overall[1 - i].counterHitRatio.count;
                counterhittotal[i] = counterhittotal[i] + data.stats[a].overall[1 - i].counterHitRatio.total;
            }
        }
        console.log("Inputs Spieler" + i + inputs);
        console.log(inputs + " + " + minutes);
        ipm[i] = inputs / minutes;
        damagepergame[i] = damage / games;
        dashdance[i] = dashdances / games;
        if (wallTechOverall[i] > 0) {
            walltechratio[i] = (wallTechSuccess[i] / wallTechOverall[i]) * 100;
        } else {
            walltechratio[i] = '---';
        }
        if (groundTechOverall[i] > 0) {
            groundtechratio[i] = (groundTechSuccess[i] / groundTechOverall[i]) * 100;
        } else {
            groundtechratio[i] = '---';
        }
        if (counterhittotal[i] == 0) {
            counterhit[i] = "---";
        } else {
            counterhit[i] = (counterhitsuccess[i] / counterhittotal[i]) * 100;
        }
        if (kills == 0) {
            openingsperkill[i] = "---";
        } else {
            openingsperkill[i] = openings / kills;
        }
        if (openings == 0) {
            damageperopenings[i] = "---";
        } else {
            damageperopenings[i] = damage / openings;
        }
        if (conversionSuccessTotal[i] == 0) {
            conversionsuccess[i] = "---";
        } else {
            conversionsuccess[i] = (conversionSuccessTotal[i] / conversionTotal[i]) * 100;
        }
    }

    for (var i = 0; i < games; i++) {
        if (playerslippiport1 == data.settings[i].players[0].port) {
            dataport1[i] = data.settings[i].players[0].port;
            dataport2[i] = data.settings[i].players[1].port;
            var frames = data.stats[i].playableFrameCount;
            var secounds = Math.trunc(frames / 60);
            var minutes = Math.trunc(secounds / 60);
            secounds = secounds % 60;
            if (secounds < 10) {
                secounds = '0' + secounds.toString();
                console.log(secounds)
            }
            timer[i] = minutes + ':' + secounds
            stocksleft1[i] = data.settings[i].players[0].startStocks;
            stocksleft2[i] = data.settings[i].players[1].startStocks;
            console.log("StockLeft 1 " + stocksleft1[i]);
            stocks1[i] = data.settings[i].players[0].startStocks;
            stocks2[i] = data.settings[i].players[1].startStocks;
            for (var t = 0; t < data.stats[i].stocks.length; t++) {
                if (data.stats[i].stocks[t].endFrame != null) {
                    if (data.stats[i].stocks[t].playerIndex == data.settings[i].players[0].playerIndex) {
                        stocksleft1[i] = stocksleft1[i] - 1
                    } else {
                        stocksleft2[i] = stocksleft2[i] - 1

                    }
                }
            }
            stages[i] = 0;
            stages[i] = data.settings[i].stageId;
            character1[i] = data.settings[i].players[0].characterId;
            character2[i] = data.settings[i].players[1].characterId;
            charactercolor1[i] = data.settings[i].players[0].characterColor;
            charactercolor2[i] = data.settings[i].players[1].characterColor;
        } else {
            dataport1[i] = data.settings[i].players[1].port;
            dataport2[i] = data.settings[i].players[0].port;
            var frames = data.stats[i].playableFrameCount;
            var secounds = Math.trunc(frames / 60);
            var minutes = Math.trunc(secounds / 60);
            secounds = secounds % 60;
            if (secounds < 10) {
                secounds = '0' + secounds.toString()
                console.log(secounds)
            }
            timer[i] = minutes + ':' + secounds
            stocksleft1[i] = data.settings[i].players[1].startStocks;
            stocksleft2[i] = data.settings[i].players[0].startStocks;
            stocks1[i] = data.settings[i].players[1].startStocks;
            stocks2[i] = data.settings[i].players[0].startStocks;
            for (var t = 0; t < data.stats[i].stocks.length; t++) {
                if (data.stats[i].stocks[t].endFrame != null) {
                    if (data.stats[i].stocks[t].playerIndex == data.settings[i].players[1].playerIndex) {
                        stocksleft1[i] = stocksleft1[i] - 1
                    } else {
                        stocksleft2[i] = stocksleft2[i] - 1

                    }
                }
            }
            stages[i] = 0;
            stages[i] = data.settings[i].stageId;
            character1[i] = data.settings[i].players[1].characterId;
            character2[i] = data.settings[i].players[0].characterId;
            charactercolor1[i] = data.settings[i].players[1].characterColor;
            charactercolor2[i] = data.settings[i].players[0].characterColor;

        }
    }
    await callback();

}

async function insertStats() {
    console.log("inserting stats")
    const games = piio.getScore(1) + piio.getScore(2);
    for (var i = 0, y = 1; i < 2; i++, y++) {
        await insertStatsPerson(i, y);
    }

}
function slippistatsloaded() {
    jQuery('#headerdiv').animate({ "left": "288", "top": "20", "width": "1344", "height": "84" }, 500);
    let player1fontsize = parseFloat($('#playerfield1').css("font-size")) * (2 / 3);
    let player2fontsize = parseFloat($('#playerfield2').css("font-size")) * (2 / 3);
    $('#playerfield1').animate({ "font-size": player1fontsize, "height": 54 }, 500);
    $('#playerfield2').animate({ "font-size": player2fontsize, "height": 54 }, 500);
    $('.playerpronoun').animate({ "font-size": 20, "opacity": 1 }, 500);
    $('.playerteam').animate({ "top": 0, "opacity": 1 }, 500);
    $('#phase').animate({ "font-size": 20 }, 500);
    $('#tournamentscore').animate({ "left": 492, "width": 360 }, 500);
    $('#score').animate({ "opacity": 1 }, 500, function () {
        $('.toptable').animate({ "top": 202, "opacity": 1 }, 400, function () {
            $('.bottomtable').animate({ "top": 565, "opacity": 1 }, 400);
        });
    });

}
// Wait until the state of the socket is not ready and send the message when it is...
function sendMessage(games) {
    stats.getStats(games)
        .then(response => { resolveStats(response) });
}
// Make the function wait until the connection is made...
function waitForSocketConnection(socket, callback) {
    setTimeout(
        function () {
            if (socket.readyState === 1) {
                console.log("Connection is made")
                if (callback != null) {
                    callback();
                }
            } else {
                waitForSocketConnection(socket, callback);
            }

        }, 5); // wait 5 milisecond for the connection...
}
async function mostoccurent(arr) {
    let max = null, maxCount = -Infinity;
    const counts = new Map();

    for (const el of arr) {
        const count = (counts.get(el) || 0) + 1;
        counts.set(el, count);
        if (count > maxCount) {
            maxCount = count;
            max = el;
        }
    }
    return [max, maxCount];
}
async function insertStatsPerson(i, y) {

    if (neutralwins[i] + neutralwins[1 - i] != 0) {
        neutralWinRatio = (neutralwins[i] / (neutralwins[i] + neutralwins[1 - i]) * 100);
    } else {
        neutralWinRatio = "---"
    }
    jQuery('#opk' + y).text((typeof openingsperkill[i] === "number") ? openingsperkill[i].toFixed(1) : openingsperkill[i]);
    jQuery('#dpo' + y).text((typeof damageperopenings[i] === "number") ? damageperopenings[i].toFixed(1) : damageperopenings[i]);
    if (i == 0) {
        jQuery('#csr' + y).text("(" + conversionSuccessTotal[i] + "/" + conversionTotal[i] + ") " + ((typeof conversionsuccess[i] === "number") ? conversionsuccess[i].toFixed(1) + "%" : conversionsuccess[i]));
    } else {
        jQuery('#csr' + y).text(((typeof conversionsuccess[i] === "number") ? conversionsuccess[i].toFixed(1) + "%" : conversionsuccess[i]) + " (" + conversionSuccessTotal[i] + "/" + conversionTotal[i] + ")");
    }
    jQuery('#mukm' + y).text(killmove[i]);
    if (i == 0) {
        jQuery('#gtr' + y).text("(" + groundTechSuccess[i] + "/" + groundTechOverall[i] + ") " + ((typeof groundtechratio[i] === "number") ? (groundtechratio[i].toFixed(1) + "%") : groundtechratio[i]));
    } else {
        jQuery('#gtr' + y).text(((typeof groundtechratio[i] === "number") ? (groundtechratio[i].toFixed(1) + "%") : groundtechratio[i]) + " (" + groundTechSuccess[i] + "/" + groundTechOverall[i] + ")");
    }
    if (i == 0) {
        jQuery('#wtr' + y).text("(" + wallTechSuccess[i] + "/" + wallTechOverall[i] + ") " + ((typeof walltechratio[i] === "number") ? walltechratio[i].toFixed(1) + "%" : walltechratio[i]));
    } else {
        jQuery('#wtr' + y).text(((typeof walltechratio[i] === "number") ? walltechratio[i].toFixed(1) + "%" : walltechratio[i]) + " (" + wallTechSuccess[i] + "/" + wallTechOverall[i] + ")");
    }
    if (i == 0) {
        jQuery('#chr' + y).text("(" + counterhitsuccess[i] + "/" + counterhittotal[i] + ") " + ((typeof counterhit[i] === "number") ? counterhit[i].toFixed(1) + "%" : counterhit[i]));
    } else {
        jQuery('#chr' + y).text(((typeof counterhit[i] === "number") ? (counterhit[i].toFixed(1) + "%") : counterhit[i]) + " (" + counterhitsuccess[i] + "/" + counterhittotal[i] + ")");
    }
    if (deaths[i].length > 0) {
        jQuery('#ld' + y).text(deaths[i][deaths[i].length - 1].toFixed(1) + '%');
    } else {
        jQuery('#ld' + y).text('---');
    }

    jQuery('#muns' + y).text(conversionmove[i]);
    if (i == 0) {
        jQuery('#nwr' + y).text("(" + neutralwins[i] + "/" + (neutralwins[i] + neutralwins[1 - i]) + ") " + ((typeof neutralWinRatio === "number") ? neutralWinRatio.toFixed(1) + "%" : neutralWinRatio));
    } else {
        jQuery('#nwr' + y).text(((typeof neutralWinRatio === "number") ? neutralWinRatio.toFixed(1) + "%" : neutralWinRatio) + " (" + neutralwins[i] + "/" + (neutralwins[i] + neutralwins[1 - i]) + ")");
    }
    jQuery('#ddpg' + y).text((typeof dashdance[i] === "number") ? dashdance[i].toFixed(1) : dashdance[i]);
    jQuery('#lgpg' + y).text((typeof ledgegrabcount[i] === "number") ? ledgegrabcount[i].toFixed(1) : ledgegrabcount[i]);

    if (deaths[1 - i].length > 0) {
        jQuery('#ek' + y).text(deaths[1 - i][0].toFixed(1) + '%');
    } else {
        jQuery('#ek' + y).text('---');
    }
    if (deaths[1 - i].length > 0) {
        jQuery('#ak' + y).text(average(deaths[1 - i]).toFixed(1) + '%');
    } else {
        jQuery('#ak' + y).text('---');
    }
    jQuery('#ipm' + y).text((typeof ipm[i] === "number") ? ipm[i].toFixed(1) : ipm[i]);
    jQuery('#tddpg' + y).text((typeof damagepergame[i] === "number") ? damagepergame[i].toFixed(1) : damagepergame[i]);
}

function fileExists(url) {
    if (url) {
        var req = new XMLHttpRequest();
        req.open('GET', url, false);
        req.send();
        return req.status == 200;
    } else {
        return false;
    }
}
