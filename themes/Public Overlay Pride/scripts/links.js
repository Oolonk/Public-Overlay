var piio = new PiioConnector("links");
var startgg;
piio.on("scoreboard", (data) => {
  if (startgg != piio.cache.scoreboard.fields.smashgg.value) {
    startgg = piio.cache.scoreboard.fields.smashgg.value;
    jQuery('#smashggbg').animate({ "opacity": 0 }, 500, function () {
      jQuery('#smashgg').text("/" + startgg);
      jQuery('#smashggbg').animate({ "opacity": 1 }, 500);
    })
  }
});
