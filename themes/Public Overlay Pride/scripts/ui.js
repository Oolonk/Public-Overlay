
var piio = new PiioConnector("ui", ["scoreboard", 'slippiFrame']);
var realtime;
const nana_perc = false;
piio.on("slippiFrame", (data) => {
  slippi2 = jQuery.extend(true, {}, data);
  var maxtime;

  if (piio.cache.scoreboard.type == "crews") {
    if (document.getElementById("introdoubles"))
      document.getElementById("introdoubles").remove();
    if (started == false && piio.cache.scoreboard.fields.bo.value != "freeplay") {
      jQuery('#introsingles').css('opacity', '1');
      introcrews(data.settings.players);
    } else {
      setTimeout(() => {
        if (started == false) {
          if (document.getElementById("introsingles"))
            document.getElementById("introsingles").remove();
          started = true;
        }
      }, 200);
    }
  } else if (piio.cache.scoreboard.type == "teams" && piio.cache.scoreboard.teams[1].players.length > 1) {
    if (document.getElementById("introsingles"))
      document.getElementById("introsingles").remove();
    if (started == false && piio.cache.scoreboard.fields.bo.value != "freeplay") {
      jQuery('#introdoubles').css('opacity', '1');
      introdoubles(slippi2.settings.players);
    } else {
      setTimeout(() => {
        if (started == false) {
          if (document.getElementById("introdoubles"))
            document.getElementById("introdoubles").remove();
          started = true;
        }
      }, 200);
    }
  } else {
    if (document.getElementById("introdoubles"))
      document.getElementById("introdoubles").remove();
    if (started == false && piio.cache.scoreboard.fields.bo.value != "freeplay") {
      jQuery('#introsingles').css('opacity', '1');
      introsingles(data.settings.players);
    } else {
      setTimeout(() => {
        if (started == false) {
          if (document.getElementById("introsingles"))
            document.getElementById("introsingles").remove();
          started = true;
        }
      }, 200);
    }
  }

  //Timer function
  maxtime = slippi2.settings.startingTimerSeconds * 60;
  frame = slippi2.latestFrameIndex < 0 ? 0 : slippi2.latestFrameIndex;
  var minutes = Math.floor((maxtime - frame) / 3600);
  var seconds = Math.floor(((maxtime - frame) % 3600) / 60);
  var miliseconds = Math.floor(((maxtime - frame) / .6) % 100);
  if (data.settings.stageId != 2294) {
    if (document.getElementById("timerdiv").style.opacity == 0) {
      jQuery("#timerdiv").animate({ "opacity": "1" }, 200);
    }
  }
  else {
    jQuery("#timerdiv").css({ opacity: 0 });
  }
  jQuery('#timerminute').text(`${minutes.toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false })}:${seconds.toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false })}`);
  jQuery('#timerms').text(miliseconds.toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false }));



  if (data.settings.players.length == 2) {
    slippi2.settings.players[2] = jQuery.extend(true, {}, data.settings.players[1]);
    jQuery("#leftoverlay").css({ 'left': 444 });
  } else if (data.settings.players.length == 4 && data.settings.isTeams) {
    if (!(slippi2.settings.players[0].teamId == slippi2.settings.players[1].teamId)) {

      if (slippi2.settings.players[0].teamId == slippi2.settings.players[2].teamId) {
        var b = data.settings.players[1];
        slippi2.settings.players[1] = data.settings.players[2];
        slippi2.settings.players[2] = b;
      } else if (slippi2.settings.players[0].teamId == slippi2.settings.players[3].teamId) {
        var a = data.settings.players[2];
        var b = data.settings.players[1];
        slippi2.settings.players[1] = data.settings.players[3];
        slippi2.settings.players[2] = b;
        slippi2.settings.players[3] = a;
      }
    }
    if (slippi2.frame.players[slippi2.settings.players[0].playerIndex].post.internalCharacterId == slippi2.frame.players[slippi2.settings.players[1].playerIndex].post.internalCharacterId && slippi2.settings.players[0].characterColor == slippi2.settings.players[1].characterColor)
      jQuery(".stockcolor2").css({ 'filter': "brightness(167%) saturate(116%)" });
    else
      jQuery(".stockcolor2").css({ 'filter': "brightness(100%) saturate(100%)" });
    if (slippi2.frame.players[slippi2.settings.players[2].playerIndex].post.internalCharacterId == slippi2.frame.players[slippi2.settings.players[3].playerIndex].post.internalCharacterId && slippi2.settings.players[2].characterColor == slippi2.settings.players[3].characterColor)
      jQuery(".stockcolor4").css({ 'filter': "brightness(167%) saturate(116%)" });
    else
      jQuery(".stockcolor4").css({ 'filter': "brightness(100%) saturate(100%)" });
  } else if (data.settings.players.length == 3) {
    jQuery("#leftoverlay").css({ 'left': 112 });
  } else if (data.settings.players.length == 4) {
    jQuery("#leftoverlay").css({ 'left': 112 });
  }


  if (ports.length == 0) {
    playerUpdate(slippi2.settings.players);
  }
  ports = slippi2.settings.players;


  for (var i = 0; i < 4; i++) {
    var y = i + 1;
    if (slippi2.settings.players.length > i && (!(i == 1 && data.settings.players.length == 2))) {
      if (slippi2.frame.players[slippi2.settings.players[i].playerIndex]) {
        if (slippi2.frame.players[slippi2.settings.players[i].playerIndex].post.actionStateId < 11) {
          if (!jQuery(`#playercolor${y}`).is(':animated') && (jQuery(`#playercolor${y}`).css('opacity') != 0.3 || jQuery(`#playeroverlay${y}`).css('opacity') != 1)) {
            jQuery(`#playerpercentage${y}`).animate({ "opacity": "0" }, 200);
            jQuery(`#playercolor${y}`).animate({ "opacity": "0.3" }, 200);
            jQuery(`#playeroverlay${y}`).animate({ "opacity": "1" }, 200);
          }
        } else {
          if (!jQuery(`#playercolor${y}`).is(':animated') && (jQuery(`#playercolor${y}`).css('opacity') != 1 || jQuery(`#playeroverlay${y}`).css('opacity') != 1)) {
            jQuery(`#playerpercentage${y}`).animate({ "opacity": "1" }, 200);
            jQuery(`#playercolor${y}`).animate({ "opacity": "1" }, 200);
            jQuery(`#playeroverlay${y}`).animate({ "opacity": "1" }, 200);
          }
        }
      } else {
        if (!jQuery(`#playercolor${y}`).is(':animated') && (jQuery(`#playercolor${y}`).css('opacity') != 0.3 || jQuery(`#playeroverlay${y}`).css('opacity') != 1)) {
          jQuery(`#playerpercentage${y}`).animate({ "opacity": "0" }, 200);
          jQuery(`#playercolor${y}`).animate({ "opacity": "0.3" }, 200);
          jQuery(`#playeroverlay${y}`).animate({ "opacity": "1" }, 200);
        }
      }
    } else {
      jQuery(`#playerpercentage${y}`).animate({ "opacity": "0" }, 20);
      jQuery(`#playercolor${y}`).animate({ "opacity": "0" }, 200);
      jQuery(`#playeroverlay${y}`).animate({ "opacity": "0" }, 200);
    }
  }
  for (var i = 0; i < slippi2.settings.players.length; i++) {
    if (slippi2.frame.players[slippi2.settings.players[i].playerIndex]) {
      const y = i + 1;
      if (slippi2.settings.isTeams) {
        if (slippi2.settings.players[i].teamId == 0) {
          jQuery(`#playercolor${y}`).css({ 'background-color': "rgb(var(--p1))" });
          jQuery(`.char${y}`).css({ 'color': "rgb(var(--p1))" });
        } else if (slippi2.settings.players[i].teamId == 1) {
          jQuery(`#playercolor${y}`).css({ 'background-color': "rgb(var(--p2))" });
          jQuery(`.char${y}`).css({ 'color': "rgb(var(--p2))" });
        } else {
          jQuery(`#playercolor${y}`).css({ 'background-color': "rgb(var(--p4))" });
          jQuery(`.char${y}`).css({ 'color': "rgb(var(--p4))" });
        }
      } else {
        if (slippi2.settings.players[i].type == 1) {
          jQuery(`#playercolor${y}`).css({ 'background-color': "rgb(var(--cpu))" });
          jQuery(`.char${y}`).css({ 'color': "rgb(var(--cpu))" });
        } else if (slippi2.settings.players[i].port == 1) {
          jQuery(`#playercolor${y}`).css({ 'background-color': "rgb(var(--p1))" });
          jQuery(`.char${y}`).css({ 'color': "rgb(var(--p1))" });
        } else if (slippi2.settings.players[i].port == 2) {
          jQuery(`#playercolor${y}`).css({ 'background-color': "rgb(var(--p2))" });
          jQuery(`.char${y}`).css({ 'color': "rgb(var(--p2))" });
        } else if (slippi2.settings.players[i].port == 3) {
          jQuery(`#playercolor${y}`).css({ 'background-color': "rgb(var(--p3))" });
          jQuery(`.char${y}`).css({ 'color': "rgb(var(--p3))" });
        } else {
          jQuery(`#playercolor${y}`).css({ 'background-color': "rgb(var(--p4))" });
          jQuery(`.char${y}`).css({ 'color': "rgb(var(--p4))" });
        }
      }
      //jQuery("#playercolor" + y).css({'width':slippi2.frame.players[slippi2.settings.players[i].playerIndex].post.shieldSize*(55/12)});
      jQuery(`.perc${y}`).css({ 'color': `rgb(${Math.floor(256 - ((slippi2.frame.players[slippi2.settings.players[i].playerIndex].post.percent / 500) * 256))}, ${Math.floor(256 - ((slippi2.frame.players[slippi2.settings.players[i].playerIndex].post.percent / 250) * 256))}, ${Math.floor(256 - ((slippi2.frame.players[slippi2.settings.players[i].playerIndex].post.percent / 250) * 256))})` });

      jQuery(`.stock${y}`).attr("src", piio.getPictureUrl(`assets/slippi/char/stock-icon-${internalID(slippi2.frame.players[slippi2.settings.players[i].playerIndex].post.internalCharacterId)}-${slippi2.settings.players[i].characterColor}`));
      jQuery(`#percentage${y}`).text(Math.floor(slippi2.frame.players[slippi2.settings.players[i].playerIndex].post.percent));
      if (nana_perc) {
        jQuery(`#playercombo${y}`).css('opacity', '0');
        if (typeof slippi2.frame.followers !== 'undefined') {
          if (typeof slippi2.frame.followers[slippi2.settings.players[i].playerIndex] !== 'undefined' && slippi2.frame.followers[slippi2.settings.players[i].playerIndex] !== null) {
            jQuery(`#nanapercentage${y}`).text(Math.floor(slippi2.frame.followers[slippi2.settings.players[i].playerIndex].post.percent));
            jQuery(`.nanaperc${y}`).css({ 'color': `rgb(${Math.floor(256 - ((slippi2.frame.followers[slippi2.settings.players[i].playerIndex].post.percent / 500) * 256))}, ${Math.floor(256 - ((slippi2.frame.followers[slippi2.settings.players[i].playerIndex].post.percent / 250) * 256))}, ${Math.floor(256 - ((slippi2.frame.followers[slippi2.settings.players[i].playerIndex].post.percent / 250) * 256))})` });
            if (!jQuery(`#nana${y}`).is(':animated') && jQuery(`#nana${y}`).css('opacity') != 1) {
              jQuery(`#nana${y}`).animate({ "opacity": "1" }, 200);
            }
          } else {
            if (!jQuery(`#nana${y}`).is(':animated') && jQuery(`#nana${y}`).css('opacity') != 0) {
              jQuery(`#nana${y}`).animate({ "opacity": "0" }, 200);
            }
          }
        } else {
          if (!jQuery(`#nana${y}`).is(':animated') && jQuery(`#nana${y}`).css('opacity') != 0) {
            jQuery(`#nana${y}`).animate({ "opacity": "0" }, 200);
          }
        }
      }
      else {
        jQuery("#nana" + y).css('opacity', '0');
        //Combo function
        const comboarray = [...slippi2.combo]
        const combos = comboarray.filter(combo => combo.lastHitBy == slippi2.settings.players[i].playerIndex && (combo.endFrame == null || combo.endFrame >= (slippi2.latestFrameIndex - 180)));
        var hitcount = combos.filter(combo => combo.moves.sum("hitCount") >= 3);
        if (hitcount.length != 0) {
          if (hitcount[hitcount.length - 1].moves.sum("hitCount") > 999)
            jQuery(`#combo${y}`).text(999);
          else
            jQuery(`#combo${y}`).text(hitcount[hitcount.length - 1].moves.sum("hitCount"));
          jQuery(`#playercombo${y}`).css('opacity', '1');
          if (hitcount[hitcount.length - 1].endFrame) {
            if (slippi2.settings.isTeams == null) {
              if (slippi2.settings.players[i].teamId == 0) {
                jQuery(`.char${y}`).css({ 'color': "rgb(var(--p1))" });
              } else if (slippi2.settings.players[i].teamId == 1) {
                jQuery(`.char${y}`).css({ 'color': "rgb(101, 101, 255)" });
              } else {
                jQuery(`.char${y}`).css({ 'color': "rgb(76, 228, 76)" });
              }
            } else {
              if (slippi2.settings.players[i].type == 1) {
                jQuery(`.char${y}`).css({ 'color': "rgb(var(--cpu))" });
              } else if (slippi2.settings.players[i].port == 1) {
                jQuery(`.char${y}`).css({ 'color': "rgb(var(--p1))" });
              } else if (slippi2.settings.players[i].port == 2) {
                jQuery(`.char${y}`).css({ 'color': "rgb(var(--p2))" });
              } else if (slippi2.settings.players[i].port == 3) {
                jQuery(`.char${y}`).css({ 'color': "rgb(var(--p3))" });
              } else {
                jQuery(`.char${y}`).css({ 'color': "rgb(var(--p4))" });
              }
            }

          } else {
            jQuery(`.char${y}`).css({ 'color': "#ffffff" });

          }
        } else {
          jQuery(`#playercombo${y}`).css('opacity', '0');

        }

      }
      for (var x = 1; x < 5; x++) {
        if (x > slippi2.settings.players[i].startStocks) {
          if (!jQuery(`#playerstock${y}${x}`).is(':animated') && jQuery(`#playerstock${y}${x}`).css('opacity') != 0) {
            jQuery(`#playerstock${y}${x}`).animate({ "opacity": ".5" }, 200);
            jQuery(`#playerstock${y}${x}`).css({ 'filter': "brightness(0%)" });
          }
        } else if (x > slippi2.frame.players[slippi2.settings.players[i].playerIndex].post.stocksRemaining) {
          if (!jQuery(`#playerstock${y}${x}`).is(':animated') && jQuery(`#playerstock${y}${x}`).css('opacity') != .5) {
            jQuery(`#playerstock${y}${x}`).animate({ "opacity": ".5" }, 200);
            jQuery(`#playerstock${y}${x}`).css({ 'filter': "brightness(0%)" });
          }
        } else {
          if (!jQuery(`#playerstock${y}${x}`).is(':animated') && jQuery("#playerstock" + y + '' + x).css('opacity') != 1) {
            jQuery(`#playerstock${y}${x}`).animate({ "opacity": "1" }, 200);
            jQuery(`#playerstock${y}${x}`).css({ 'filter': '' });
          }

        }

        //hitanimation
        if (slippi2.frame.players[slippi2.settings.players[i].playerIndex].post.percent > slippi2.frame.players[slippi2.settings.players[i].playerIndex].pre.percent) {
          var diff = slippi2.frame.players[slippi2.settings.players[i].playerIndex].post.percent - slippi2.frame.players[slippi2.settings.players[i].playerIndex].pre.percent;
          diff = Math.log(diff);
          if (damage[i] == 0) {
            damage[i] = 1;
            // jQuery("#playerblack" + y).stop();
            jQuery(`#playeranimation${y}`).stop();
            // jQuery("#playerblack" + y).css('left', 0);
            // jQuery("#playerblack" + y).css('bottom', 2);
            jQuery(`#playeranimation${y}`).css('left', 0);
            jQuery(`#playeranimation${y}`).css('bottom', 0);
            // jQuery("#playerblack" + y).animate({"left": 2* diff}, 100/3, "easeOutQuint");
            // jQuery("#playerblack" + y).animate({"bottom": (4* diff)+2}, 100/3, "easeOutQuint");
            jQuery(`#playeranimation${y}`).animate({ "left": 2 * diff }, 100 / 3, "easeOutQuint");
            jQuery(`#playeranimation${y}`).animate({ "bottom": 4 * diff }, 100 / 3, "easeOutQuint");
          } else {
            damage[i] = 0;
            diff = - diff;
            // jQuery("#playerblack" + y).stop();
            jQuery(`#playeranimation${y}`).stop();
            // jQuery("#playerblack" + y).css('left', 0);
            // jQuery("#playerblack" + y).css('bottom', 2);
            jQuery(`#playeranimation${y}`).css('left', 0);
            jQuery(`#playeranimation${y}`).css('bottom', 0);
            // jQuery("#playerblack" + y).animate({"left": 2* diff}, 100/3, "easeOutQuint");
            // jQuery("#playerblack" + y).animate({"bottom": (4* diff)+2}, 100/3, "easeOutQuint");
            jQuery(`#playeranimation${y}`).animate({ "left": 2 * diff }, 100 / 3, "easeOutQuint");
            jQuery(`#playeranimation${y}`).animate({ "bottom": 4 * diff }, 100 / 3, "easeOutQuint");
          }

        } else {
          if (!jQuery(`#playeranimation${y}`).is(':animated') && jQuery(`#playercolor${y}`).css('left') != 0) {
            // jQuery("#playerblack" + y).animate({"left": 0}, 100/3);
            // jQuery("#playerblack" + y).animate({"bottom": 2}, 100/3);
            jQuery(`#playeranimation${y}`).animate({ "left": 0 }, 100 / 3);
            jQuery(`#playeranimation${y}`).animate({ "bottom": 0 }, 100 / 3);
          }
        }

      }
    }
  }

  //End function
  if (slippi2.gameEnd || slippi2.lras) {
    if (slippi2.gameEnd == 7) {
      if (piio.cache.scoreboard.fields.switchtoend.enabled) {
        window.obsstudio.setCurrentScene(piio.cache.scoreboard.fields.switchtoend.value);
      }
      jQuery('#timerminute').text("");
      jQuery('#timerms').text("");

      jQuery("#gameEnd").css('opacity', '0');
      jQuery(".gameEndVertical").css('width', '0');
      jQuery("#timerdiv").css('opacity', '0');
      for (var z = 1; z < 5; z++) {
        jQuery(`#nana${z}`).css('opacity', '0');
        jQuery(`#playeroverlay${z}`).css('opacity', '0');
        jQuery(`#playerpercentage${z}`).css('opacity', '0');
        for (var a = 1; a < 5; a++) {
          jQuery(`#playerstock${z}${a}`).css('opacity', '0');
        }
      }
    } else {
      var text = "Game!";
      if (slippi2.gameEnd == 1) {
        var text = "Time!"
      }
      jQuery('#gameEndSpan').text(text);
      jQuery("#gameEnd").animate({ "opacity": "1" }, 200);
      jQuery(".gameEndVertical").animate({ "width": 1356 }, 1000);

      setTimeout(function () {
        if (piio.cache.scoreboard.fields.switchtoend.enabled) {
          window.obsstudio.setCurrentScene(piio.cache.scoreboard.fields.switchtoend.value);
        }
        jQuery("#gameEnd").css('opacity', '0');
        jQuery(".gameEndVertical").css('width', '0');
        jQuery('#timerminute').text("");
        jQuery('#timerms').text("");
        for (var z = 1; z < 5; z++) {
          jQuery(`#nana${z}`).css('opacity', '0');
          jQuery('#timerdiv').css('opacity', '0');
          jQuery(`#playeroverlay${z}`).css('opacity', '0');
          jQuery(`#playerpercentage${z}`).css('opacity', '0');
          for (var a = 1; a < 5; a++) {
            jQuery(`#playerstock${z}${a}`).css('opacity', '0');
          }
        }
      }, 2100);
    }
  }
});

piio.on("scoreboard", (data) => {
  console.log(data);
  if (tournamentname != piio.cache.scoreboard.fields.tournamentname.value) {
    tournamentname = piio.cache.scoreboard.fields.tournamentname.value;
    jQuery('#tournamentnamediv').animate({ "opacity": 0 }, 500, function () {
      jQuery('#tournamentname').text(tournamentname);
      jQuery("#tournamentname").css({ 'font-size': "35px" });
      while (jQuery('#tournamentname').width() > 1046) {
        var fontSize = parseInt(jQuery("#tournamentname").css("font-size"));
        fontSize = fontSize - 1 + "px";
        jQuery("#tournamentname").css({ 'font-size': fontSize });
      }
      var left = (1920 - jQuery('#tournamentnamediv').width()) / 2;
      jQuery("#tournamentnamediv").css({ 'left': left });
      jQuery('#tournamentnamediv').animate({ "opacity": 1 }, 500);
    });
  }
  if (bestof != piio.cache.scoreboard.fields.bo.value || phase != piio.cache.scoreboard.fields.round.value) {
    bestof = piio.cache.scoreboard.fields.bo.value;
    phase = piio.cache.scoreboard.fields.round.value;
    jQuery('#phasediv').animate({ "opacity": 0 }, 500, function () {
      if (piio.cache.scoreboard.fields.bo.enabled == true && piio.cache.scoreboard.fields.bo.value != "freeplay") {
        if (piio.cache.scoreboard.type == "crews") {
          jQuery('#bestof').text("");
          jQuery('#phase').text(phase);
          jQuery("#phase").css({ 'font-size': '50px' });
          jQuery("#phase").css({ 'line-height': '50px' });
          while (jQuery('#phase').width() > 311) {
            var fontSize = parseInt(jQuery("#phase").css("font-size"));
            fontSize = fontSize - 1 + "px";
            jQuery("#phase").css({ 'font-size': fontSize });
          }

        } else {
          jQuery('#bestof').text("Best of " + bestof);
          jQuery('#phase').text(phase);
          jQuery("#phase").css({ 'font-size': '30px' });
          jQuery("#phase").css({ 'line-height': '30px' });
          while (jQuery('#phase').width() > 311) {
            var fontSize = parseInt(jQuery("#phase").css("font-size"));
            fontSize = fontSize - 1 + "px";
            jQuery("#phase").css({ 'font-size': fontSize });
          }
        }
      } else {
        jQuery('#bestof').text("");
        jQuery('#phase').text("Freeplay");
        jQuery("#phase").css({ 'font-size': '50px' });
        jQuery("#phase").css({ 'line-height': '50px' });


      }
      jQuery('#phasediv').animate({ "opacity": 1 }, 500);
    });
  }
  if (ports.length != 0) {
    playerUpdate(ports);
  }

  if (piio.cache.scoreboard.fields.bo.value == "freeplay") {
    jQuery('.singlesscore').animate({ "opacity": 0 }, 200);
    jQuery('.doublesscore').animate({ "opacity": 0 }, 200);
    jQuery('#teamdivs').animate({ "opacity": 0 }, 200);
  } else {
    if ((piio.cache.scoreboard.type == "teams" && piio.cache.scoreboard.teams[1].players.length > 1) || piio.cache.scoreboard.type == "crews") {
      jQuery('.singlesscore').animate({ "opacity": 0 }, 200);
      jQuery('.doublesscore').animate({ "opacity": 1 }, 200);
      jQuery('#teamdivs').animate({ "opacity": 1 }, 200);
    } else {
      jQuery('.singlesscore').animate({ "opacity": 1 }, 200);
      jQuery('.doublesscore').animate({ "opacity": 0 }, 200);
      jQuery('#teamdivs').animate({ "opacity": 0 }, 200);
    }
  }
  if (piio.cache.scoreboard.type == "crews") {
    type = "crews";
  } else if (piio.cache.scoreboard.type == "teams" && piio.cache.scoreboard.teams[1].players.length > 1) {
    type = "doubles";
  } else {
    type = "singles";
  }
});
var ports = [];
var score = [-1, -1];
var ws;
var frame;
var type;
var damage = [0, 0, 0, 0];
var damage2 = [0, 0, 0, 0];
var tournamentname;
var bestof;
var phase;
var started = false;
var interval = [0, 0, 0, 0];

var playerscore = new Array(4);

var tag = new Array(4);
var pronoun = new Array(4);

var team = ['', '', '', ''];

var twitter = new Array(4);
var twitch = new Array(4);

var gf = new Array(2);
var teamname = new Array(2);

var slippi2;


Array.prototype.sum = function (prop) {
  var total = 0
  for (var i = 0, _len = this.length; i < _len; i++) {
    total += this[i][prop]
  }
  return total
}

//InternalId to Stock IconId
function internalID(value) {
  if (value == 0)
    return 0x08;
  if (value == 1)
    return 0x02;
  if (value == 2)
    return 0x00;
  if (value == 3)
    return 0x01;
  if (value == 4)
    return 0x04;
  if (value == 5)
    return 0x05;
  if (value == 6)
    return 0x06;
  if (value == 7)
    return 0x13;
  if (value == 8)
    return 0x0b;
  if (value == 9)
    return 0x0c;
  if (value == 10)
    return 0x0e;
  if (value == 11)
    return 0x0e;
  if (value == 12)
    return 0x0d;
  if (value == 13)
    return 0x10;
  if (value == 14)
    return 0x11;
  if (value == 15)
    return 0x0f;
  if (value == 16)
    return 0x0a;
  if (value == 17)
    return 0x07;
  if (value == 18)
    return 0x09;
  if (value == 19)
    return 0x12;
  if (value == 20)
    return 0x15;
  if (value == 21)
    return 0x16;
  if (value == 22)
    return 0x14;
  if (value == 23)
    return 0x18;
  if (value == 24)
    return 0x03;
  if (value == 25)
    return 0x19;
  if (value == 26)
    return 0x17;
  else
    if (value == 27)
      return 26;
  if (value == 28)
    return 27;
  if (value == 29)
    return 28;



}
function introsingles(test) {
  started = true;
  const game = piio.getScore(1) + piio.getScore(2) + 1;
  var y = 1;
  for (let port = 0; port < 2; port++) {
    if (test[port]) {
      const player = piio.cache.scoreboard.ports[test[port].port];
      if (piio.cache.scoreboard.ports[test[port].port]) {
        const playerPosition = piio.cache.scoreboard.ports[test[port].port];

        if (piio.getPort(playerPosition[0], playerPosition[1]) == "1") {
          jQuery(`#intro_team${y}_text`).css("color", "rgb(var(--p1))");
          jQuery(`#intro_name${y}_text`).css("text-shadow", "0 0 .1em rgb(var(--p1)), 0 0 .2em rgb(var(--p1))");
        } else if (piio.getPort(playerPosition[0], playerPosition[1]) == "2") {
          jQuery(`#intro_team${y}_text`).css("color", "rgb(var(--p2))");
          jQuery(`#intro_name${y}_text`).css("text-shadow", "0 0 .1em rgb(var(--p2)), 0 0 .2em rgb(var(--p2))");
        } else if (piio.getPort(playerPosition[0], playerPosition[1]) == "3") {
          jQuery(`#intro_team${y}_text`).css("color", "rgb(var(--p3))");
          jQuery(`#intro_name${y}_text`).css("text-shadow", "0 0 .1em rgb(var(--p3)), 0 0 .2em rgb(var(--p3))");
        } else if (piio.getPort(playerPosition[0], playerPosition[1]) == "4") {
          jQuery(`#intro_team${y}_text`).css("color", "rgb(var(--p4))");
          jQuery(`#intro_name${y}_text`).css("text-shadow", "0 0 .1em rgb(var(--p4)), 0 0 .2em rgb(var(--p4))");
        } else {
          jQuery(`#intro_team${y}_text`).css("color", "rgb(var(--cpu))");
          jQuery(`#intro_name${y}_text`).css("text-shadow", "0 0 .1em rgb(var(--cpu)), 0 0 .2em rgb(var(--cpu))");
        }
        if (piio.getState(playerPosition[0]) == 0)
          jQuery(`#intro_gf${y}`).text("");
        else if (piio.getState(playerPosition[0]) == 1) {
          jQuery(`#intro_gf${y}`).text(" [W]");
        } else {
          jQuery(`#intro_gf${y}`).text(" [L]");
        }
        jQuery(`#intro_name${y}_text`).text(piio.getPlayer(playerPosition[0], playerPosition[1]).name);
        if (piio.getPlayerTeams(playerPosition[0], playerPosition[1])[0] != undefined)
          jQuery(`#intro_team${y}_text`).text(piio.getPlayerTeams(playerPosition[0], playerPosition[1])[0].name);
        jQuery(`#intro_p${y}logo`).css("background-image", `url(${piio.getPictureUrl('assets/team/' + piio.getPlayer(playerPosition[0], playerPosition[1]).team[0])})`);

      }
    }
    y = y + 1;
  }
  jQuery('#intro_phase_text').text(piio.cache.scoreboard.fields.round.value);
  jQuery('#intro_game_text').text(`game ${game} out of ${piio.cache.scoreboard.fields.bo.value}`);
  while (jQuery('#intro_phase_text').width() > 1292) {
    var fontSize = parseInt(jQuery("#intro_phase_text").css("font-size"));
    fontSize = `${fontSize - 1}px`;
    jQuery("#intro_phase_text").css({ 'font-size': fontSize });
  }
  while (jQuery('#intro_game_text').width() > 1292) {
    var fontSize = parseInt(jQuery("#intro_game_text").css("font-size"));
    fontSize = `${fontSize - 1}px`;
    jQuery("#intro_game_text").css({ 'font-size': fontSize });
  }
  while (jQuery('#intro_player1').width() > 552) {
    var fontSize = parseInt(jQuery("#intro_player1").css("font-size"));
    fontSize = `${fontSize - 1}px`;
    jQuery("#intro_player1").css({ 'font-size': fontSize });
  }
  while (jQuery('#intro_player2').width() > 552) {
    var fontSize = parseInt(jQuery("#intro_player2").css("font-size"));
    fontSize = `${fontSize - 1}px`;
    jQuery("#intro_player2").css({ 'font-size': fontSize });
  }
  while (jQuery('#intro_team1_text').width() > 552) {
    var fontSize = parseInt(jQuery("#intro_team1_text").css("font-size"));
    fontSize = `${fontSize - 1}px`;
    jQuery("#intro_team1_text").css({ 'font-size': fontSize });
  }
  while (jQuery('#intro_team2_text').width() > 552) {
    var fontSize = parseInt(jQuery("#intro_team2_text").css("font-size"));
    fontSize = `${fontSize - 1}px`;
    jQuery("#intro_team2_text").css({ 'font-size': fontSize });
  }
  jQuery('.intro_divs').animate({ "width": "+1292" }, 566, "easeInOutQuart");
  jQuery('.intro_teamlogo').animate({ "opacity": ".5" }, 566);
  jQuery('#intro_game').animate({ "opacity": "1" }, 566);
  jQuery('#intro_phase').animate({ "opacity": "1" }, 566);
  setTimeout(function () {
    jQuery('.intro_text').animate({ "opacity": "1" }, 283, function () {
      setTimeout(function () {
        jQuery('#introsingles').animate({ "opacity": "0" }, 283, function () {
          if (document.getElementById("introsingles"))
            document.getElementById("introsingles").remove();
        });
      }, 1000);
    });
  }, 283);
}

function introdoubles(test) {
  try {
    started = true;
    let test2 = [...test];

    if (!(test2[0].teamId == test2[1].teamId)) {

      if (test2[0].teamId == test2[2].teamId) {
        var b = test2[1];
        test[1] = test2[2];
        test[2] = b;
      } else if (test2[0].teamId == test2[3].teamId) {
        var a = test2[2];
        var b = test2[1];
        test[1] = test2[3];
        test[2] = b;
        test[3] = a;
      }
    }
    let team1color = test[0].teamId;
    let team1ports = [[test[0].port, test[1].port], test[2].port, test[3].port];
    let teamCache = [0, 0];
    let teamlinkstrue = 2;
    if (piio.getPort(1) == team1ports[0][0] || piio.getPort(1) == team1ports[0][1]) {
      teamlinkstrue = 1;
    }

    if (piio.getState(1) == 0)
      $(`#intro_gf${teamlinkstrue}`).text("");
    else if (piio.getState(1) == 1)
      $(`#intro_gf${teamlinkstrue}`).text(" [W]");
    else
      $(`#intro_gf${teamlinkstrue}`).text(" [L]");

    if (piio.getState(2) == 0)
      $(`#intro_gf${3 - teamlinkstrue}`).text("");
    else if (piio.getState(1) == 1)
      $(`#intro_gf${3 - teamlinkstrue}`).text("[W] ");
    else
      $(`#intro_gf${3 - teamlinkstrue}`).text("[L] ");
    for (let i = 0; i < 2; i++) {
      for (let y = 0; y < 2; y++) {
        let z = y + (i * 2);
        let ports = piio.cache.scoreboard.ports[test[z].port]
        console.log(`#intro_player${i + 1}name${z + 1}_text`);
        $(`#intro_player${y + 1}name${i + 1}_text`).text(piio.getPlayer(ports[0], ports[1]).name);
        $(`#intro_player${y + 1}team${i + 1}_text`).text(piio.getPlayer(ports[0], ports[1]).name);
        jQuery(`#intro_team${y + 1}p${i + 1}logo`).css("background-image", `url(${piio.getPictureUrl('assets/team/' + piio.getPlayer(ports[0], ports[1]).team[0])})`);
      }
    }
    $('#intro_team1_text').text(piio.getTeamName(teamlinkstrue));
    $('#intro_team2_text').text(piio.getTeamName(3 - teamlinkstrue));
    if (test[0].teamId == 0) {
      jQuery('#intro_player1team1_text').css("color", "rgb(var(--p1))");
      jQuery('#intro_player1name1_text').css("text-shadow", "0 0 .1em rgb(var(--p1)), 0 0 .2em rgb(var(--p1))");
      jQuery('#intro_player2team1_text').css("color", "rgb(var(--p1))");
      jQuery('#intro_player2name1_text').css("text-shadow", "0 0 .1em rgb(var(--p1)), 0 0 .2em rgb(var(--p1))");
    } else if (test[0].teamId == 1) {
      jQuery('#intro_player1team1_text').css("color", "rgb(var(--p2))");
      jQuery('#intro_player1name1_text').css("text-shadow", "0 0 .1em rgb(var(--p2)), 0 0 .2em rgb(var(--p2))");
      jQuery('#intro_player2team1_text').css("color", "rgb(var(--p2))");
      jQuery('#intro_player2name1_text').css("text-shadow", "0 0 .1em rgb(var(--p2)), 0 0 .2em rgb(var(--p2))");
    } else if (test[0].teamId == 2) {
      jQuery('#intro_player1team1_text').css("color", "rgb(var(--p4))");
      jQuery('#intro_player1name1_text').css("text-shadow", "0 0 .1em rgb(var(--p4)), 0 0 .2em rgb(var(--p4))");
      jQuery('#intro_player2team1_text').css("color", "rgb(var(--p4))");
      jQuery('#intro_player2name1_text').css("text-shadow", "0 0 .1em rgb(var(--p4)), 0 0 .2em rgb(var(--p4))");
    } else {
      jQuery('#intro_player1team1_text').css("color", "rgb(var(--cpu))");
      jQuery('#intro_player1name1_text').css("text-shadow", "0 0 .1em rgb(var(--cpu)), 0 0 .2em rgb(var(--cpu))");
      jQuery('#intro_player2team1_text').css("color", "rgb(var(--cpu))");
      jQuery('#intro_player2name1_text').css("text-shadow", "0 0 .1em rgb(var(--cpu)), 0 0 .2em rgb(var(--cpu))");
    }
    if (test[2].teamId == 0) {
      jQuery('#intro_player1team2_text').css("color", "rgb(var(--p1))");
      jQuery('#intro_player1name2_text').css("text-shadow", "0 0 .1em rgb(var(--p1)), 0 0 .2em rgb(var(--p1))");
      jQuery('#intro_player2team2_text').css("color", "rgb(var(--p1))");
      jQuery('#intro_player2name2_text').css("text-shadow", "0 0 .1em rgb(var(--p1)), 0 0 .2em rgb(var(--p1))");
    } else if (test[2].teamId == 1) {
      jQuery('#intro_player1team2_text').css("color", "rgb(var(--p2))");
      jQuery('#intro_player1name2_text').css("text-shadow", "0 0 .1em rgb(var(--p2)), 0 0 .2em rgb(var(--p2))");
      jQuery('#intro_player2team2_text').css("color", "rgb(var(--p2))");
      jQuery('#intro_player2name2_text').css("text-shadow", "0 0 .1em rgb(var(--p2)), 0 0 .2em rgb(var(--p2))");
    } else if (test[2].teamId == 2) {
      jQuery('#intro_player1team2_text').css("color", "rgb(var(--p4))");
      jQuery('#intro_player1name2_text').css("text-shadow", "0 0 .1em rgb(var(--p4)), 0 0 .2em rgb(var(--p4))");
      jQuery('#intro_player2team2_text').css("color", "rgb(var(--p4))");
      jQuery('#intro_player2name2_text').css("text-shadow", "0 0 .1em rgb(var(--p4)), 0 0 .2em rgb(var(--p4))");
    } else {
      jQuery('#intro_player1team2_text').css("color", "rgb(var(--cpu))");
      jQuery('#intro_player1name2_text').css("text-shadow", "0 0 .1em rgb(var(--cpu)), 0 0 .2em rgb(var(--cpu))");
      jQuery('#intro_player2team2_text').css("color", "rgb(var(--cpu))");
      jQuery('#intro_player2name2_text').css("text-shadow", "0 0 .1em rgb(var(--cpu)), 0 0 .2em rgb(var(--cpu))");
    }
    const game = piio.getScore(1) + piio.getScore(2) + 1;
    jQuery('#intro_phase_text').text(piio.cache.scoreboard.fields.round.value);
    jQuery('#intro_game_text').text(`game ${game} out of ${piio.cache.scoreboard.fields.bo.value}`);
    while (jQuery('#intro_phase_text').width() > 1292) {
      var fontSize = parseInt(jQuery("#intro_phase_text").css("font-size"));
      fontSize = `${fontSize - 1}px`;
      jQuery("#intro_phase_text").css({'font-size': fontSize});
    }
    while (jQuery('#intro_game_text').width() > 1292) {
      var fontSize = parseInt(jQuery("#intro_game_text").css("font-size"));
      fontSize = `${fontSize - 1}px`;
      jQuery("#intro_game_text").css({'font-size': fontSize});
    }
    while (jQuery('#intro_player1player1').width() > 552) {
      var fontSize = parseInt(jQuery("#intro_player1player1").css("font-size"));
      fontSize = `${fontSize - 1}px`;
      jQuery("#intro_player1player1").css({'font-size': fontSize});
    }
    while (jQuery('#intro_player1player2').width() > 552) {
      var fontSize = parseInt(jQuery("#intro_player1player2").css("font-size"));
      fontSize = `${fontSize - 1}px`;
      jQuery("#intro_player1player2").css({'font-size': fontSize});
    }
    while (jQuery('#intro_player1team1_text').width() > 552) {
      var fontSize = parseInt(jQuery("#intro_player1team1_text").css("font-size"));
      fontSize = `${fontSize - 1}px`;
      jQuery("#intro_player1team1_text").css({'font-size': fontSize});
    }
    while (jQuery('#intro_player1team2_text').width() > 552) {
      var fontSize = parseInt(jQuery("#intro_player1team2_text").css("font-size"));
      fontSize = `${fontSize - 1}px`;
      jQuery("#intro_player1team2_text").css({'font-size': fontSize});
    }
    while (jQuery('#intro_player2player1').width() > 552) {
      var fontSize = parseInt(jQuery("#intro_player2player1").css("font-size"));
      fontSize = `${fontSize - 1}px`;
      jQuery("#intro_player2player1").css({'font-size': fontSize});
    }
    while (jQuery('#intro_player2player2').width() > 552) {
      var fontSize = parseInt(jQuery("#intro_player2player2").css("font-size"));
      fontSize = `${fontSize - 1}px`;
      jQuery("#intro_player2player2").css({'font-size': fontSize});
    }
    while (jQuery('#intro_player2team1_text').width() > 552) {
      var fontSize = parseInt(jQuery("#intro_player2team1_text").css("font-size"));
      fontSize = `${fontSize - 1}px`;
      jQuery("#intro_player2team1_text").css({'font-size': fontSize});
    }
    while (jQuery('#intro_player2team2_text').width() > 552) {
      var fontSize = parseInt(jQuery("#intro_player2team2_text").css("font-size"));
      fontSize = `${fontSize - 1}px`;
      jQuery("#intro_player2team2_text").css({'font-size': fontSize});
    }
    while (jQuery('#intro_team1span').height() > 320) {
      var fontSize = parseInt(jQuery("#intro_team1span").css("font-size"));
      fontSize = `${fontSize - 1}px`;
      jQuery("#intro_team1span").css({'font-size': fontSize});
    }
    while (jQuery('#intro_team2span').height() > 320) {
      var fontSize = parseInt(jQuery("#intro_team2span").css("font-size"));
      fontSize = `${fontSize - 1}px`;
      jQuery("#intro_team2span").css({'font-size': fontSize});
    }
    jQuery('.intro_divs').animate({"width": "+1292"}, 566, "easeInOutQuart");
    jQuery('.intro_teamlogo').animate({"opacity": ".5"}, 556);
    jQuery('#intro_game').animate({"opacity": "1"}, 556);
    jQuery('#intro_phase').animate({"opacity": "1"}, 556);
    setTimeout(function () {
      jQuery('.intro_text').animate({"opacity": "1"}, 283, function () {
        setTimeout(function () {
          jQuery('#introdoubles').animate({"opacity": "0"}, 283, function () {
            if (document.getElementById("introdoubles"))
              document.getElementById("introdoubles").remove();
          });
        }, 1000);
      });
    }, 283);
  } catch (e) {

    document.getElementById("introdoubles").remove();
  }
}

function introcrews(test) {
  started = true;
  const game = piio.getScore(1) + piio.getScore(2) + 1;
  var y = 1;
  for (let port = 0; port < 2; port++) {
    if (test[port]) {
      const player = piio.cache.scoreboard.ports[test[port].port];
      if (piio.cache.scoreboard.ports[test[port].port]) {
        const playerPosition = piio.cache.scoreboard.ports[test[port].port];

        if (piio.getPort(playerPosition[0], playerPosition[1]) == "1") {
          jQuery(`#intro_team${y}_text`).css("color", "rgb(var(--p1))");
          jQuery(`#intro_name${y}_text`).css("text-shadow", "0 0 .1em rgb(var(--p1)), 0 0 .2em rgb(var(--p1))");
        } else if (piio.getPort(playerPosition[0], playerPosition[1]) == "2") {
          jQuery(`#intro_team${y}_text`).css("color", "rgb(var(--p2))");
          jQuery(`#intro_name${y}_text`).css("text-shadow", "0 0 .1em rgb(var(--p2)), 0 0 .2em rgb(var(--p2))");
        } else if (piio.getPort(playerPosition[0], playerPosition[1]) == "3") {
          jQuery(`#intro_team${y}_text`).css("color", "rgb(var(--p3))");
          jQuery(`#intro_name${y}_text`).css("text-shadow", "0 0 .1em rgb(var(--p3)), 0 0 .2em rgb(var(--p3))");
        } else if (piio.getPort(playerPosition[0], playerPosition[1]) == "4") {
          jQuery(`#intro_team${y}_text`).css("color", "rgb(var(--p4))");
          jQuery(`#intro_name${y}_text`).css("text-shadow", "0 0 .1em rgb(var(--p4)), 0 0 .2em rgb(var(--p4))");
        } else {
          jQuery(`#intro_team${y}_text`).css("color", "rgb(var(--cpu))");
          jQuery(`#intro_name${y}_text`).css("text-shadow", "0 0 .1em rgb(var(--cpu)), 0 0 .2em rgb(var(--cpu))");
        }
        if (piio.getState(playerPosition[0]) == 0)
          jQuery(`#intro_gf${y}`).text("");
        else if (piio.getState(playerPosition[0]) == 1) {
          jQuery(`#intro_gf${y}`).text(" [W]");
        } else {
          jQuery(`#intro_gf${y}`).text(" [L]");
        }
        jQuery(`#intro_name${y}_text`).text(piio.getPlayer(playerPosition[0], playerPosition[1]).name);
        if (piio.getPlayerTeams(playerPosition[0], playerPosition[1])[0] != undefined)
          jQuery(`#intro_team${y}_text`).text(piio.getPlayerTeams(playerPosition[0], playerPosition[1])[0].name);
        jQuery(`#intro_p${y}logo`).css("background-image", `url(${piio.getPictureUrl('assets/team/' + piio.getPlayer(playerPosition[0], playerPosition[1]).team[0])})`);

      }
    }
    y = y + 1;
  }
  jQuery('#intro_phase_text').text(piio.cache.scoreboard.fields.round.value);

  if (test[0] && piio.cache.scoreboard.ports[test[0].port] && test[1] && piio.cache.scoreboard.ports[test[1].port])
    jQuery('#intro_game_text').text(piio.getTeamName(piio.cache.scoreboard.ports[test[0].port][0]) + " vs. " + piio.getTeamName(piio.cache.scoreboard.ports[test[1].port][0]));
  while (jQuery('#intro_phase_text').width() > 1292) {
    var fontSize = parseInt(jQuery("#intro_phase_text").css("font-size"));
    fontSize = `${fontSize - 1}px`;
    jQuery("#intro_phase_text").css({ 'font-size': fontSize });
  }
  while (jQuery('#intro_game_text').width() > 1292) {
    var fontSize = parseInt(jQuery("#intro_game_text").css("font-size"));
    fontSize = `${fontSize - 1}px`;
    jQuery("#intro_game_text").css({ 'font-size': fontSize });
  }
  while (jQuery('#intro_player1').width() > 552) {
    var fontSize = parseInt(jQuery("#intro_player1").css("font-size"));
    fontSize = `${fontSize - 1}px`;
    jQuery("#intro_player1").css({ 'font-size': fontSize });
  }
  while (jQuery('#intro_player2').width() > 552) {
    var fontSize = parseInt(jQuery("#intro_player2").css("font-size"));
    fontSize = `${fontSize - 1}px`;
    jQuery("#intro_player2").css({ 'font-size': fontSize });
  }
  while (jQuery('#intro_team1_text').width() > 552) {
    var fontSize = parseInt(jQuery("#intro_team1_text").css("font-size"));
    fontSize = fontSize - 1 + "px";
    jQuery("#intro_team1_text").css({ 'font-size': fontSize });
  }
  while (jQuery('#intro_team2_text').width() > 552) {
    var fontSize = parseInt(jQuery("#intro_team2_text").css("font-size"));
    fontSize = `${fontSize - 1}px`;
    jQuery("#intro_team2_text").css({ 'font-size': fontSize });
  }
  jQuery('.intro_divs').animate({ "width": "+1292" }, 566, "easeInOutQuart");
  jQuery('.intro_teamlogo').animate({ "opacity": ".5" }, 566);
  jQuery('#intro_game').animate({ "opacity": "1" }, 566);
  jQuery('#intro_phase').animate({ "opacity": "1" }, 566);
  setTimeout(function () {
    jQuery('.intro_text').animate({ "opacity": "1" }, 283, function () {
      setTimeout(function () {
        jQuery('#introsingles').animate({ "opacity": "0" }, 283, function () {
          if (document.getElementById("introsingles"))
            document.getElementById("introsingles").remove();
        });
      }, 1000);
    });
  }, 283);
}

function playerUpdate(portArray) {
  for (let port = 0; port < 4; port++) {
    const y = port + 1;
    if (portArray[port]) {
      const player = piio.cache.scoreboard.ports[portArray[port].port];
      if (piio.cache.scoreboard.ports[portArray[port].port]) {
        jQuery(`#playercardopacity${y}`).animate({ "opacity": "1" }, 200);
        const playerPosition = piio.cache.scoreboard.ports[portArray[port].port];
        if (piio.getPlayer(playerPosition[0], playerPosition[1]).name != tag[port]) {
          tag[port] = piio.getPlayer(playerPosition[0], playerPosition[1]).name;
          jQuery(`.playerflag${y}`).animate({ "opacity": "0" }, 200);
          jQuery(`#playerdiv${y}`).animate({ "opacity": "0" }, 200, function () {
            jQuery(`#playerdiv${y}`).css({ 'font-size': "25px" });
            jQuery(`#playerpronoun${y}`).css({ 'font-size': "15px" });
            if (piio.getPlayer(playerPosition[0], playerPosition[1]).pride.length == 0) {
              jQuery(`#playerflag${y}1`).css('background-image', ``);
              jQuery(`#playerflag${y}2`).css('background-image', ``);
            } else if (piio.getPlayer(playerPosition[0], playerPosition[1]).pride.length == 1) {
              jQuery(`#playerflag${y}1`).css('background-image', `url(${piio.getPictureUrl('assets/pride/' + piio.getPlayer(playerPosition[0], playerPosition[1]).pride[0])})`);
              jQuery(`#playerflag${y}2`).css('background-image', `url(${piio.getPictureUrl('assets/pride/' + piio.getPlayer(playerPosition[0], playerPosition[1]).pride[0])})`);
            } else {
              jQuery(`#playerflag${y}1`).css('background-image', `url(${piio.getPictureUrl('assets/pride/' + piio.getPlayer(playerPosition[0], playerPosition[1]).pride[0])})`);
              jQuery(`#playerflag${y}2`).css('background-image', `url(${piio.getPictureUrl('assets/pride/' + piio.getPlayer(playerPosition[0], playerPosition[1]).pride[1])})`);
            }
            jQuery(`#playername${y}`).text(piio.getPlayer(playerPosition[0], playerPosition[1]).name);
            jQuery(`#playerpronoun${y}`).text(piio.getPlayer(playerPosition[0], playerPosition[1]).pronoun.toLowerCase());
            while (jQuery(`#playerdiv${y}`).width() > 207) {
              var fontSize = parseInt(jQuery(`#playerdiv${y}`).css("font-size"));
              fontSize = `${fontSize - 1}px`;
              jQuery(`#playerdiv${y}`).css({ 'font-size': fontSize });
              jQuery(`#playerpronoun${y}`).css({ 'font-size': (fontSize * 0.6) });
            }
            jQuery(`.playerflag${y}`).animate({ "opacity": "1" }, 200);
            jQuery(`#playerdiv${y}`).animate({ "opacity": "1" }, 200);
          });
        }
        if ((piio.getPlayer(playerPosition[0], playerPosition[1]).team.length == 0 && team[port] != '') || (piio.getPlayer(playerPosition[0], playerPosition[1]).team.length > 0 && piio.getPlayer(playerPosition[0], playerPosition[1]).team[0] != team[port])) {
          jQuery(`#playerteam${y}`).animate({ "opacity": "0" }, 200);
          jQuery(`#playerteamlogo${y}`).animate({ "opacity": "0" }, 200, function () {
            var teamName = '';
            team[port] = '';
            if (piio.getPlayer(playerPosition[0], playerPosition[1]).team.length > 0) {
              team[port] = piio.getPlayer(playerPosition[0], playerPosition[1]).team[0];
              teamName = piio.getPlayerTeams(playerPosition[0], playerPosition[1])[0].name;
            }
            jQuery("#playerteamlogo" + y).css('background-image', `url(${piio.getPictureUrl('assets/team/' + piio.getPlayer(playerPosition[0], playerPosition[1]).team[0])})`);
            jQuery(`#playerteam${y}`).text(teamName);
            jQuery(`#playerteam${y}`).css({ 'font-size': "25px" });
            while (jQuery(`#playerteam${y}`).width() > 207) {
              var fontSize = parseInt(jQuery(`#playerteam${y}`).css("font-size"));
              fontSize = `${fontSize - 1}px`;
              jQuery(`#playerteam${y}`).css({ 'font-size': fontSize });
            }
            jQuery(`#playerteamlogo${y}`).animate({ "opacity": "1" }, 200);
            jQuery(`#playerteam${y}`).animate({ "opacity": "1" }, 200);
          });
        }
        if (piio.getPlayer(playerPosition[0], playerPosition[1]).twitter != twitter[port]) {
          twitter[port] = piio.getPlayer(playerPosition[0], playerPosition[1]).twitter;
          jQuery(`#playertwitter${y}`).animate({ "opacity": "0" }, 200, function () {
            jQuery(`#playertwitter${y}`).css({ 'font-size': "25px" });
            jQuery(`#playertwitter${y}`).text('@' + piio.getPlayer(playerPosition[0], playerPosition[1]).twitter);
            while (jQuery(`#playertwitter${y}`).width() > 207) {
              var fontSize = parseInt(jQuery(`#playertwitter${y}`).css("font-size"));
              fontSize = fontSize - 1 + "px";
              jQuery(`#playertwitter${y}`).css({ 'font-size': fontSize });
            }
            jQuery(`#playertwitter${y}`).animate({ "opacity": "1" }, 200);
          });
        }

      } else {
        // Hide Player Card (
        if (jQuery(`#playercolor${y}`).css('opacity') == 1)
          jQuery(`#playercardopacity${y}`).animate({ "opacity": "0" }, 200);

      }
    }
  }
  changeTeam(portArray);
}

function changeTeam(portArray) {
  var y = 1;
  var i = 0;
  for (let port = 0; port < 3; port = port + 2) {
    if (portArray[port] && port != 1) {
      const player = piio.cache.scoreboard.ports[portArray[port].port];
      if (piio.cache.scoreboard.ports[portArray[port].port]) {
        const playerPosition = piio.cache.scoreboard.ports[portArray[port].port];
        var teamnamecache = "";
        if (piio.getTeamName(playerPosition[0]) == "") {
          var teamnamecache2 = [];
          for (let player in piio.cache.scoreboard.teams[playerPosition[0]].players) {
            teamnamecache2[teamnamecache2.length] = player.name
          }
          teamnamecache = teamnamecache2.join('/')
        } else {
          teamnamecache = piio.getTeamName(playerPosition[0]);
        }
        if (piio.getScore(playerPosition[0]) != score[i]) {
          changeScore(i, y, playerPosition[0]);
        }
        if (piio.getState(playerPosition[0]) != gf[i]) {
          changeGF(i, y, playerPosition[0], playerPosition[1], port);
        }
        if (teamnamecache != teamname[i]) {
          console.log("test")
          changeTeamName(i, y, teamnamecache);
        }
      }
      i++;
      y++;
    }
  }
}
function changeScore(i, y, playerPosition) {
  jQuery(`.score${y}`).animate(
    { "opacity": "0" }, {
    duration: 200,
    complete: function () {
      score[i] = piio.getScore(playerPosition);
      jQuery(`.score${y}`).text(piio.getScore(playerPosition));
      jQuery(`.score${y}`).animate({ "opacity": "1" }, { durration: 200 });
    }
  });
}
function changeTeamName(i, y, teamnamecache) {
  teamname[i] = teamnamecache;
  jQuery(`#teamdiv${y}`).animate(
    { "opacity": "0" }, {
    duration: 200,
    complete: function () {
      console.log(teamnamecache);
      jQuery(`#teamname${y}`).text(teamnamecache);
      if (y == 1) {
        const left = 432 - (jQuery(`#teamdiv${y}`).width() / 2);
        jQuery(`#teamdiv${y}`).css({ 'left': left });
      } else {
        const right = 432 - (jQuery(`#teamdiv${y}`).width() / 2);
        jQuery(`#teamdiv${y}`).css({ 'right': right });
      }
      jQuery(`#teamdiv${y}`).animate({ "opacity": "1" }, { durration: 200 });
    }
  });
}
function changeGF(i, y, playerPosition0, playerPosition1, port) {
  const port2 = port + 1;
  var gfcache;
  gf[i] = piio.getState(playerPosition0);
  if (piio.getState(playerPosition0) == 0) {
    gfcache = "";
  } else if (piio.getState(playerPosition0) == 1) {
    gfcache = "[W]";
  } else {
    gfcache = "[L]";
  }
  if (type == "doubles" || type == "crews") {
    if (jQuery('#playergf' + port2).text() != "") {
      jQuery("#playerdiv" + port2).animate({ "opacity": "0" }, 200);
      jQuery(`.playerflag${port2}`).animate({ "opacity": "0" }, 200, function () {
        jQuery(`#playerdiv${port2}`).css({ 'font-size': "25px" });
        jQuery(`#playerpronoun${y}`).css({ 'font-size': "15px" });
        jQuery(`#playergf${port2}`).text("");
        while (jQuery(`#playerdiv${port2}`).width() > 207) {
          var fontSize = parseInt(jQuery(`#playerdiv${y}`).css("font-size"));
          fontSize = `${fontSize - 1}px`;
          jQuery(`#playerdiv${port2}`).css({ 'font-size': fontSize });
          jQuery(`#playerpronoun${port2}`).css({ 'font-size': (fontSize * 0.6) });
        }
        jQuery(`.playerflag${port2}`).animate({ "opacity": "1" }, 200);
        jQuery(`#playerdiv${port2}`).animate({ "opacity": "1" }, 200);
      });
    }
    jQuery(`#teamdiv${y}`).animate({ "opacity": "0" }, 200, function () {
      jQuery(`#teamgf${y}`).text(gfcache);
      jQuery(`#teamdiv${y}`).animate({ "opacity": "1" }, 200);
    });

  } else {
    tag[port] = piio.getPlayer(playerPosition0, playerPosition1).name;
    jQuery(`#playerdiv${port2}`).animate({ "opacity": "0" }, 200);
    jQuery(`.playerflag${port2}`).animate({ "opacity": "0" }, 200, function () {
      jQuery(`#playerdiv${port2}`).css({ 'font-size': "25px" });
      jQuery(`#playerpronoun${y}`).css({ 'font-size': "15px" });
      jQuery(`#playergf${port2}`).text(gfcache);
      while (jQuery(`#playerdiv${port2}`).width() > 207) {
        var fontSize = parseInt(jQuery(`#playerdiv${y}`).css("font-size"));
        fontSize = `${fontSize - 1}px`;
        jQuery(`#playerdiv${port2}`).css({ 'font-size': fontSize });
        jQuery(`#playerpronoun${port2}`).css({ 'font-size': (fontSize * 0.6) });
      }
      jQuery(`.playerflag${port2}`).animate({ "opacity": "1" }, 200);
      jQuery(`#playerdiv${port2}`).animate({ "opacity": "1" }, 200);
    });
  }
}
//Scrolling through the card player info
setInterval(() => {
  for (var port = 0; port < 4; port++) {
    changePlayerDisplay(interval[port], port);
  }
}, 11000);
function changePlayerDisplay(intervalnum, port) {
  var i = port + 1
  if (intervalnum == 0) {
    jQuery(`#cardname${i}`).animate({ "opacity": "1" }, { durration: 200 });
    jQuery(`#cardteam${i}`).animate({ "opacity": "0" }, { durration: 200 });
    jQuery(`#cardtwitter${i}`).animate({ "opacity": "0" }, { durration: 200 });
    interval[port] = 1;
  }
  else if (intervalnum == 1) {
    if (jQuery(`#playerteam${i}`).text() != '') {
      jQuery(`#cardname${i}`).animate({ "opacity": "0" }, { durration: 200 });
      jQuery(`#cardteam${i}`).animate({ "opacity": "1" }, { durration: 200 });
      jQuery(`#cardtwitter${i}`).animate({ "opacity": "0" }, { durration: 200 });
      interval[port] = 2;
    }
    else {
      intervalnum = 2;
      changePlayerDisplay(intervalnum, port);
    }
  }
  else if (intervalnum == 2) {
    jQuery(`#cardname${i}`).animate({ "opacity": "1" }, { durration: 200 });
    jQuery(`#cardteam${i}`).animate({ "opacity": "0" }, { durration: 200 });
    jQuery(`#cardtwitter${i}`).animate({ "opacity": "0" }, { durration: 200 });
    interval[port] = 3;
  } else {
    if (jQuery(`#playertwitter${i}`).text() != '' && jQuery('#playertwitter' + i).text() != '@') {
      jQuery(`#cardname${i}`).animate({ "opacity": "0" }, { durration: 200 });
      jQuery(`#cardteam${i}`).animate({ "opacity": "0" }, { durration: 200 });
      jQuery(`#cardtwitter${i}`).animate({ "opacity": "1" }, { durration: 200 });
      interval[port] = 0;
    } else {
      intervalnum = 0;
      changePlayerDisplay(intervalnum, port);
    }
  }
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
