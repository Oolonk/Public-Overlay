
var piio = new PiioConnector("commentator");
var commentator = [];
var twitter = [];


piio.on("scoreboard", (data) => {
    if (piio.cache.scoreboard.caster.length != commentator.length) {
        commentator.length = piio.cache.scoreboard.caster.length;
        twitter.length = piio.cache.scoreboard.caster.length;
    }
    piio.cache.scoreboard.caster.forEach((caster, index) => {
        console.log(index);
        var index2 = index + 1;
        if (commentator[index] != caster.name) {
            jQuery('#c' + index2 + 'top').animate({ "opacity": "0" }, 400, function () {
                commentator[index] = caster.name;
                jQuery('#c' + index2 + 'flag').css('background-image', 'url(assets/country/' + caster.country + '.svg)');
                jQuery('#c' + index2 + 'team').text(caster.team.length > 0 ? piio.cache.team[caster.team].prefix : '');
                jQuery('#c' + index2 + 'teamicon').css('background-image', caster.team.length > 0 ? 'url(assets/team/' + caster.team + '.svg)' : '');
                jQuery('#c' + index2 + 'name').text(caster.name);
                jQuery('#c' + index2 + 'pron').text(caster.pronoun);
                jQuery("#playertext" + index2).css({ 'font-size': '25px' });
                while (jQuery("#playertext" + index2).width() > 282) {
                    var fontSize = parseInt(jQuery("#playertext" + index2).css("font-size"));
                    fontSize = fontSize - 1 + "px";
                    jQuery("#playertext" + index2).css({ 'font-size': fontSize });
                }
                if (jQuery('#c' + index2 + 'name').text() != '' && jQuery('#c' + index2 + 'name').text() != null) {
                    jQuery('#c' + index2 + 'top').animate({ "opacity": "1" }, 400);
                }
            });
        }
        if (twitter[index] != caster.twitter) {
            jQuery('#c' + index2 + 'bottom').animate({ "opacity": "0" }, 400, function () {
                twitter[index] = caster.twitter;
                jQuery('#c' + index2 + 'twitter').text(caster.twitter != '' ? '@' + caster.twitter : '');
                jQuery('#c' + index2 + 'twitter').css({ 'font-size': '20px' });
                while (jQuery('#c' + index2 + 'twitter').width() > 306) {
                    var fontSize = parseInt(jQuery('#c' + index2 + 'twitter').css("font-size"));
                    fontSize = fontSize - 1 + "px";
                    jQuery('#c' + index2 + 'twitter').css({ 'font-size': fontSize });
                }
                if (jQuery('#c' + index2 + 'twitter').text() != '' && jQuery('#c' + index2 + 'twitter').text() != null) {
                    jQuery('#c' + index2 + 'bottom').animate({ "opacity": "1" }, 400);
                }
            });
        }
    });

});