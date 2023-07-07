
var piio = new PiioConnector("commentator");
var commentator = [];
var twitter = [];
var test;

piio.on("scoreboard", async (data) => {
    if (piio.cache.scoreboard.caster.length != commentator.length) {
        for (let div of jQuery('#commentatordiv').children()) {
            jQuery(div).find('.top').CSSAnimate({ scale: 0 }, 400);
            jQuery(div).find('.bottom').CSSAnimate({ scale: 0 }, 400);
        };
        setTimeout(() => {
            jQuery('#commentatordiv').css('opacity', '0');
            jQuery('#commentatordiv').html(null);
            jQuery(`#commentatordiv`).height(piio.cache.scoreboard.caster.length >= 5 ? 170 : 84)
            for (let [index, caster] of piio.cache.scoreboard.caster.entries()) {
                const y = index + 1
                let template = $("#commentatortemplate").html();
                let templateclone = $(template);
                $(templateclone).find('.top').attr("id", `c${y}top`);
                $(templateclone).find('.flag').attr("id", `c${y}flag`);
                $(templateclone).find('.playertext').attr("id", `playertext${y}`);
                $(templateclone).find('.commteam').attr("id", `c${y}team`);
                $(templateclone).find('.commname').attr("id", `c${y}name`);
                $(templateclone).find('.commpronoun').attr("id", `c${y}pron`);

                $(templateclone).find('.bottom').attr("id", `c${y}bottom`);
                $(templateclone).find('.twittertext').attr("id", `c${y}twitter`);
                $(templateclone).find('.top').css('transform', 'scale(0)');
                $(templateclone).find('.bottom').css('transform', 'scale(0)');
                console.log($(templateclone).find('.commentator'));
                $(templateclone).addClass((y % 2 == 0) ? 'commentatorbottom' : 'commentatortop');
                jQuery('#commentatordiv').append(templateclone);
            }
            console.log(($('#commentatordiv').width() / piio.cache.scoreboard.caster.length) / -2);
            // $('.centerlize').css('transform', `translateX(${-(295 / 2)}px)`);
            setTimeout(() => {
                jQuery('#commentatordiv').css('opacity', '1');
                for (let [index, caster] of piio.cache.scoreboard.caster.entries()) {
                    updateTop(index, true);
                    updateBottom(index, true);
                }
            }, 10);
        }, 410);
    } else {
        piio.cache.scoreboard.caster.forEach((caster, index) => {
            if (commentator[index] != caster.name) {
                updateTop(index, false);
            }
            if (twitter[index] != caster.twitter) {
                updateBottom(index, false);
            }
        });

    }
});

function updateTop(i, hidden) {
    const y = i + 1;
    const duration = !hidden ? 400 : 0;
    let caster = piio.cache.scoreboard.caster[i];
    jQuery(`#c${y}top`).CSSAnimate({ scale: 0 }, duration, () => {
        commentator[i] = caster.name;
        jQuery(`#c${y}flag`).css('background-image', 'url(assets/country/' + caster.country + '.svg)');
        jQuery(`#c${y}team`).text(caster.team.length > 0 ? piio.cache.team[caster.team].prefix : '');
        jQuery(`#c${y}teamicon`).css('background-image', caster.team.length > 0 ? `url(assets/team/${caster.team}.svg)` : '');
        jQuery(`#c${y}name`).text(caster.name);
        jQuery(`#c${y}pron`).text(caster.pronoun);
        jQuery(`#playertext${y}`).css({ 'font-size': '25px' });
        while (jQuery(`#playertext${y}`).width() > 207) {
            let fontSize = parseInt(jQuery(`#playertext${y}`).css("font-size"));
            fontSize--;
            jQuery(`#commpronoun${y}`).css({ 'font-size': (fontSize * 0.6) });
            jQuery(`#playertext${y}`).css({ 'font-size': fontSize });
        }
        if (caster.name != null && caster.name != '') {
            jQuery(`#c${y}top`).CSSAnimate({ scale: 1 }, 400);
        }
    });
}

function updateBottom(i, hidden) {
    const y = i + 1;
    const duration = !hidden ? 400 : 0;
    let caster = piio.cache.scoreboard.caster[i];
    jQuery(`#c${y}bottom`).CSSAnimate({ scale: 0 }, duration, function () {
        twitter[i] = caster.twitter;
        jQuery(`#c${y}twitter`).text(caster.twitter != '' ? `@${caster.twitter}` : '');
        jQuery(`#c${y}twitter`).css({ 'font-size': '20px' });
        while (jQuery(`#c${y}twitter`).width() > 207) {
            var fontSize = parseInt(jQuery(`#c${y}twitter`).css("font-size"));
            fontSize--;
            jQuery(`#c${y}twitter`).css({ 'font-size': fontSize });
        }
        if (caster.twitter != null && caster.twitter != '') {
            $(`#c${y}top`)
                .animate({
                    borderBottomLeftRadius: 0,
                    borderBottomRightRadius: 0
                }, 200);
            jQuery(`#c${y}bottom`).CSSAnimate({ scale: 1 }, 400);
        } else {

            $(`#c${y}top`)
                .animate({
                    borderBottomLeftRadius: 10,
                    borderBottomRightRadius: 10
                }, 200);
        }
    });
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
