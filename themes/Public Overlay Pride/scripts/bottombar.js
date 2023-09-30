
var piio = new PiioConnector("bottombar");
var scenename;
var locationvar;
var intervalnum = 1;
var round;
var commentatordiv;
var recentresult = [];
var recentresultCache;
var bottombarenabled = true;
var bottombarvalue;
var ingame = false;
var leftwidth = 0;
var resultsmargin = 57;
var freetext;


piio.on("ready", () => {
  realtime = new SlippiRealtimeConnector("switcher");
  realtime.on("frame", (data) => {
    if (data.gameEnd || data.lras) {
      if (piio.cache.scoreboard.fields.switchtoend.enabled && ingame) {
        ingame = false;
        if (data.gameEnd == 7) {
          if (!(scenename.includes('game'))) {
            if (piio.cache.scoreboard.fields.switchtoend.value != scenename) {
              window.obsstudio.setCurrentScene(piio.cache.scoreboard.fields.switchtoend.value);
            }
          }
        } else if (!(scenename.includes('game'))) {
          window.obsstudio.setCurrentScene(piio.cache.scoreboard.fields.switchtoend.value);

        }
      }
    } else {
      if (piio.cache.scoreboard.fields.switchtostart.enabled && !ingame) {
        ingame = true;
        if (piio.cache.scoreboard.fields.switchtostart.value != scenename) {
          window.obsstudio.setCurrentScene(piio.cache.scoreboard.fields.switchtostart.value);
        }
      }
    }
  })
});
if (window.obsstudio != undefined) {
  window.obsstudio.getCurrentScene(function (scene) {
    scenename = scene.name;
    if (scene.name.includes('game')) {
      jQuery('#resultsdiv').animate({ bottom: "20px" }, 500, function () {
        jQuery('.roundmargin').animate({ 'marginLeft': $('#resultsdiv').offset().left + $('#resultsdiv').width() - resultsmargin + 20 }, 500);
      });
      jQuery('#bottombar').animate(
        {
          left: "0px",
          width: 2395 / 24 + 'vw', //VW = 100*(px anzahl / 1920)
          borderBottomLeftRadius: "0px",
          borderBottomRightRadius: "0px",
          bottom: "0px"
        }, 500);
    } else {
      jQuery('#teamresult').animate({ bottom: "45px" }, 500, () => {
        jQuery('.roundmargin').animate({ 'marginLeft': $('#resultsdiv').offset().left + $('#resultsdiv').width() - resultsmargin + 20 }, 500);
      });
      jQuery('#bottombar').animate(
        {
          left: "50px",
          width: 1135 / 12 + 'vw', //VW = 100*(px anzahl / 1920)
          borderBottomLeftRadius: "15px",
          borderBottomRightRadius: "15px",
          bottom: "25px"
        }, 500);
    }
  });
}

piio.on("scoreboard", async (data) => {
  if (piio.cache.scoreboard.fields.location.value != locationvar) {
    let locationClassList = document.getElementsByClassName('location');
    for (let locationClass of locationClassList) {
      locationClass.classList.add('hidecontent');
      locationvar = piio.cache.scoreboard.fields.location.value;
      jQuery(".location").css({ 'font-size': '23px' });
      jQuery('.location').text(locationvar);
      if (locationvar == '') {
        jQuery(".locationtitle").css({ 'opacity': '0' });
      } else {
        jQuery(".locationtitle").css({ 'opacity': '1' });
      }
      while (jQuery('#locationid').width() > 470) {
        var fontSize = parseInt(jQuery("#locationid").css("font-size"));
        fontSize = fontSize - 1 + "px";
        await jQuery(".location").css({ 'font-size': fontSize });
      }
      // JQuery(".contentlocation").width(jQuery('#locationid').width())
      locationClass.classList.remove('hidecontent');

    }
    leftwidth = await jQuery('#locationid').width();
    console.log(await jQuery('#locationid').width());
    await jQuery('#resultsdiv').animate({ left: leftwidth + resultsmargin + 10 + 'px' }, () => {
      jQuery('.roundmargin').animate({ 'marginLeft': $('#resultsdiv').offset().left + $('#resultsdiv').width() - resultsmargin + 20 }, 500);
    });
  }
  var commentators = [];
  for (commentator of piio.cache.scoreboard.caster) {
    var team = '';
    if (commentator.name != '') {
      if (commentator.team.length > 0)
        team = piio.cache.team[commentator.team[0]].prefix + ' ';
      const value = '<span class="commentatorteam">' + team + '</span>' + commentator.name + '<span class="commentatorpronoun"> ' + commentator.pronoun.toLowerCase() + '</span>';
      commentators.push(value);
    }
  }
  var commentatorvar;
  if (commentators.length > 1) {
    const last = commentators.pop();
    commentatorvar = commentators.join(', ') + ' & ' + last;
  } else if (commentators.length == 1) {
    commentatorvar = commentators[0];
  }
  else {
    commentatorvar = '';
  }
  if (commentatorvar != commentatordiv) {
    commentatordiv = commentatorvar;
    jQuery('#commentators').animate({ "opacity": "0" }, 200, function () {
      jQuery("#commentators").css({ 'font-size': '35px' });
      jQuery('#commentators').html(commentatorvar);
      while (jQuery('#commentators').width() > 940) {
        var fontSize = parseInt(jQuery("#commentators").css("font-size"));
        fontSize = fontSize - 1 + "px";
        jQuery("#commentators").css({ 'font-size': fontSize });
      }
      jQuery('#commentators').animate({ "opacity": "1" }, 200);
    });
  }
  if (piio.cache.scoreboard.fields.bottombar.enabled != bottombarenabled) {
    if (piio.cache.scoreboard.fields.bottombar.enabled) {
      if (piio.cache.scoreboard.fields.bottombar.value == 'comingupnext' || piio.cache.scoreboard.fields.bottombar.value == 'standing') {
        $('#resultsdiv').animate({ "opacity": "1" }, 500);
        $('#resultsdiv').CSSAnimate({ scale: 1 }, 500);
      }
      $('#bottombar').animate({ "opacity": "1" }, 500);
      $('#bottombar').CSSAnimate({ scale: 1 }, 500, () => {
      });
      bottombarenabled = piio.cache.scoreboard.fields.bottombar.enabled;
    } else {
      $('#resultsdiv').animate({ "opacity": "0" }, 500);
      $('#resultsdiv').CSSAnimate({ scale: 0 }, 500);
      $('#bottombar').animate({ "opacity": "0" }, 500);
      $('#bottombar').CSSAnimate({ scale: 0 }, 500, () => {
        bottombarenabled = piio.cache.scoreboard.fields.bottombar.enabled;
      });
    }
  }
  if (piio.cache.scoreboard.fields.bottombar.value != bottombarvalue) {

    if (piio.cache.scoreboard.fields.bottombar.value == 'standing') {
      if (bottombarenabled) {
        $('#resultsdiv').animate({ "opacity": "1" }, 500);
        $('#resultsdiv').CSSAnimate({ scale: 1 }, 500, () => {
          jQuery('.roundmargin').animate({ 'marginLeft': $('#resultsdiv').offset().left + $('#resultsdiv').width() - resultsmargin + 20 }, 500);
        });
      }
      $("#twitterbar").animate({ "opacity": "0" }, { durration: 500 });
      $("#commentatorbar").animate({ "opacity": "0" }, { durration: 500 });
      $("#comingupbar").animate({ "opacity": "0" }, { durration: 500 });
      $("#standingbar").animate({ "opacity": "1" }, { durration: 500 });
      $("#recentresultsbar").animate({ "opacity": "0" }, { durration: 500 });
      $("#owntextbar").animate({ "opacity": "0" }, { durration: 500 });
      $('.score').animate({ opacity: 1 }, 200);
      $('.score').CSSAnimate({ scale: 1 }, 200);
      $("#recentresults").removeClass('marqueue');
      bottombarvalue = piio.cache.scoreboard.fields.bottombar.value;
    } else if (piio.cache.scoreboard.fields.bottombar.value == 'comingupnext') {
      if (bottombarenabled) {
      }
      $('#resultsdiv').animate({ "opacity": "1" }, 500);
      $('#resultsdiv').CSSAnimate({ scale: 1 }, 500, () => {
        jQuery('.roundmargin').animate({ 'marginLeft': $('#resultsdiv').offset().left + $('#resultsdiv').width() - resultsmargin + 20 }, 500);
      });
      $("#twitterbar").animate({ "opacity": "0" }, { durration: 500 });
      $("#commentatorbar").animate({ "opacity": "0" }, { durration: 500 });
      $("#comingupbar").animate({ "opacity": "1" }, { durration: 500 });
      $("#standingbar").animate({ "opacity": "0" }, { durration: 500 });
      $("#owntextbar").animate({ "opacity": "0" }, { durration: 500 });
      $('.score').animate({ opacity: 0 }, 200);
      $('.score').CSSAnimate({ scale: 0 }, 200);
      $("#recentresultsbar").animate({ "opacity": "0" }, { durration: 500 });
      $("#recentresults").removeClass('marqueue');
      bottombarvalue = piio.cache.scoreboard.fields.bottombar.value;
    } else if (piio.cache.scoreboard.fields.bottombar.value == 'rotation') {
      $('#resultsdiv').animate({ "opacity": "0" }, 500);
      $('#resultsdiv').CSSAnimate({ scale: 0 }, 500);
      bottombarvalue = piio.cache.scoreboard.fields.bottombar.value;
      bottombarvalue = piio.cache.scoreboard.fields.bottombar.value;
      changeBottombar();
    } else if (piio.cache.scoreboard.fields.bottombar.value == 'commentator') {
      $('#resultsdiv').animate({ "opacity": "0" }, 500);
      $('#resultsdiv').CSSAnimate({ scale: 0 }, 500);
      bottombarvalue = piio.cache.scoreboard.fields.bottombar.value;

      $("#twitterbar").animate({ "opacity": "0" }, { durration: 500 });
      $("#commentatorbar").animate({ "opacity": "1" }, { durration: 500 });
      $("#comingupbar").animate({ "opacity": "0" }, { durration: 500 });
      $("#standingbar").animate({ "opacity": "0" }, { durration: 500 });
      $("#recentresultsbar").animate({ "opacity": "0" }, { durration: 500 });
      $("#owntextbar").animate({ "opacity": "0" }, { durration: 500 });
      $("#recentresults").removeClass('marqueue');
    } else if (piio.cache.scoreboard.fields.bottombar.value == 'freetext') {
      $('#resultsdiv').animate({ "opacity": "0" }, 500);
      $('#resultsdiv').CSSAnimate({ scale: 0 }, 500);
      $("#twitterbar").animate({ "opacity": "0" }, { durration: 500 });
      $("#commentatorbar").animate({ "opacity": "0" }, { durration: 500 });
      $("#comingupbar").animate({ "opacity": "0" }, { durration: 500 });
      $("#standingbar").animate({ "opacity": "0" }, { durration: 500 });
      $("#recentresultsbar").animate({ "opacity": "0" }, { durration: 500 });
      $("#owntextbar").animate({ "opacity": "1" }, { durration: 500 });
      bottombarvalue = piio.cache.scoreboard.fields.bottombar.value;
    }
  }
  if (piio.cache.scoreboard.fields.round.value != round) {
    $('.roundvalue').animate({ "opacity": "0" }, 500, () => {
      jQuery('.roundvalue').text(piio.cache.scoreboard.fields.round.value);

      $('.roundvalue').animate({ "opacity": "1" }, 500, () => {
        round = piio.cache.scoreboard.fields.round.value;
      });
    });

  }
  if (piio.cache.scoreboard.fields.freetext.value != freetext) {
    $('#owntext').animate({ "opacity": "0" }, 500, () => {
      jQuery('#owntext').html(piio.cache.scoreboard.fields.freetext.value);

      $('#owntext').animate({ "opacity": "1" }, 500, () => {
        freetext = piio.cache.scoreboard.fields.freetext.value;
      });
    });

  }
});




// Timer function
function display_c() {
  var refresh = 1000; // Refresh rate in milli seconds
  mytime = setTimeout('display_ct()', refresh)
}
function display_ct() {
  var x = new Date()
  var hour = x.getHours();
  var minute = x.getMinutes();
  var second = x.getSeconds();
  if (hour < 10) { hour = '0' + hour; }
  if (minute < 10) { minute = '0' + minute; }
  if (second < 10) { second = '0' + second; }
  var x3 = hour + ':' + minute;
  jQuery('.timer').text(x3);
  display_c();
}

// setInterval(() => {
//   changeBottombar();
// }, 10000);
// function changeBottombar() {
//   if (bottombarvalue == "rotation") {
//     if (intervalnum == 0) {
//       jQuery("#twitterbar").animate({ "opacity": "1" }, { durration: 400 });
//       jQuery("#commentatorbar").animate({ "opacity": "0" }, { durration: 400 });
//       jQuery("#comingupbar").animate({ "opacity": "0" }, { durration: 400 });
//       jQuery("#recentresultsbar").animate({ "opacity": "0" }, { durration: 400 });
//       jQuery("#standingbar").animate({ "opacity": "0" }, { durration: 400 });
//       $("#owntextbar").animate({ "opacity": "0" }, { durration: 400 });
//       jQuery("#recentresults").removeClass('marqueue');
//       intervalnum = 1;
//     }
//     else if (intervalnum == 1) {
//       jQuery("#twitterbar").animate({ "opacity": "0" }, { durration: 400 });
//       jQuery("#commentatorbar").animate({ "opacity": "1" }, { durration: 400 });
//       jQuery("#comingupbar").animate({ "opacity": "0" }, { durration: 400 });
//       jQuery("#recentresultsbar").animate({ "opacity": "0" }, { durration: 400 });
//       jQuery("#standingbar").animate({ "opacity": "0" }, { durration: 400 });
//       $("#owntextbar").animate({ "opacity": "0" }, { durration: 400 });
//       jQuery("#recentresults").removeClass('marqueue');
//       intervalnum = 2;
//     } else {
//       intervalnum = 0;
//       changeBottombar();
//     }
//   }
// }
