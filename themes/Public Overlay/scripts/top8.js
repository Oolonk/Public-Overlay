
var piio = new PiioConnector("Top8");
const winnersSetAmount = 5;
const losersSetAmount = 6;
const maxWinnersPlacement = 5;
const maxLosersPlacement = 7;
var started = false;
var losersSide;
var winnersSide;
var grandFinalReset = false;
var metadata = {};
var phaseId;
// var phaseId = 1137321;
async function getData(url) {
  const response = await fetch(url);
  return (response).json();
}
function sortByKey(array, key, key2) {
  return array.sort(function (a, b) {
    let x = a[key];
    let y = b[key];
    let x2 = a[key2];
    let y2 = b[key2];
    return ((x < y) ? -1 : ((x > y) ? 1 : ((x2 < y2) ? -1 : ((x2 > y2) ? 1 : 0))));
  })
}
async function getCountryCode(id) {
  let regions = await getData('/assets/startgg/regions.json');
  let region = (await regions).find(item => item.smashgg_id == parseInt(id));
  if (await region == null) {
    return null;
  } else if ((await region).countryCode == null) {
    return region.country;
  }
  else {
    return region.countryCode;
  }
}
const groupBy = (array, key) => {
  // Return the end result
  return array.reduce((result, currentValue) => {
    // If an array already present for key, push it to the array. Else create an array and push the object
    (result[currentValue[key]] = result[currentValue[key]] || []).push(
      currentValue
    );
    // Return the current iteration `result` value, this will be taken as next iteration `result` value and accumulate
    return result;
  }, {}); // empty object is the initial value for result object
};
const arrayReverseObj =
  obj => Object.keys(obj).sort().reverse().map(key => ({ ...obj[key] }));
// var phaseId = 1366407;
piio.on("ready", () => {
});

piio.on("scoreboard", async (data) => {
  if (!started) {
    started = true;
    phaseId = data.startgg.phase;
    // Eismas Intermediate
    // phaseId = 1368850;
    // JeDo 169
    // phaseId = 1436448;
    // Single Elimination Test Turnier
    // phaseId = 1137321;
    let metadataData = (await getMetadata(phaseId)).data.phase;
    metadata.bracketType = metadataData.bracketType;
    metadata.phase = metadataData.name;
    metadata.event = metadataData.event.name;
    metadata.tournament = metadataData.event.tournament.name;
    metadata.phasesLength = metadataData.event.phases.length;
    console.log('metadata', metadata);
    jQuery('#tournamentname').text(metadata.tournament);
    jQuery("#tournamentname").css({ 'font-size': "35px" });
    while (jQuery('#tournamentname').width() > 1046) {
      let fontSize = parseInt(jQuery("#tournamentname").css("font-size"));
      fontSize = fontSize - 1;
      jQuery("#tournamentname").css({ 'font-size': fontSize });
    }
    jQuery("#tournamentnamediv").css({ 'left': (1920 - jQuery('#tournamentnamediv').width()) / 2 });
    jQuery('#event').text(metadata.phasesLength > 1 ? `${metadata.event} - ${metadata.phase}` : metadata.event);
    jQuery("#event").css({ 'font-size': "35px" });
    while (jQuery('#event').width() > 1046) {
      let fontSize = parseInt(jQuery("#event").css("font-size"));
      fontSize = fontSize - 1;
      jQuery("#event").css({ 'font-size': fontSize });
    }
    jQuery("#eventdiv").css({ 'left': (1920 - jQuery('#eventdiv').width()) / 2 });
    switch (metadata.bracketType) {
      case "DOUBLE_ELIMINATION":
        doubleElim();
        break;
    }
  }
});

async function doubleElim() {
  losersSide = (await getLosers(phaseId)).data.phase;
  metadata.pageInfo = losersSide.sets.pageInfo;
  losersSide = await losersSide.sets.nodes;
  losersSide = sortByKey(await losersSide, 'lPlacement', 'id');
  winnersSide = (await getWinners(phaseId, await metadata.pageInfo.total)).data.phase.sets.nodes;
  winnersSide = sortByKey(await winnersSide, 'round', 'id');
  if ((await winnersSide)[0].length == 2) {
    winnersSide[0].shift();
  }

  winnersSide = await winnersSide.filter((set => set.lPlacement <= maxWinnersPlacement));
  losersSide = await losersSide.filter((set => set.lPlacement <= maxLosersPlacement));

  winnersSide = await winnersSide.filter((set => set.round > 0));
  losersSide = await losersSide.filter((set => set.round < 0));
  let gf = (await winnersSide).find(item => item.fullRoundText == 'Grand Final');
  if ((await winnersSide).length != 0 && (await winnersSide).some(obj => obj.fullRoundText === 'Grand Final Reset') && gf != null && gf.state == 3) {
    grandFinalReset = true;
  }
  if (!grandFinalReset) {
    $("#reset-text").remove();
    winnersSide = (await winnersSide).filter(function (obj) {
      return obj.fullRoundText !== 'Grand Final Reset';
    })
  }
  winnersSide = groupBy(await winnersSide, 'round');
  losersSide = groupBy(await losersSide, 'lPlacement');
  winnersSide = arrayReverseObj(await winnersSide);
  console.log('Winners Side', winnersSide);
  console.log('Losers Side', losersSide);
  loopSide(true, winnersSide);
  loopSide(false, losersSide);
  $(`#reset-text`).animate({ "opacity": "1" }, { durration: 400 });
  $(`#reset-text`).CSSAnimate({ scale: 1 }, 400);
  $(`#tournamentnamediv`).animate({ "opacity": "1" }, { durration: 400 });
  $(`#tournamentnamediv`).CSSAnimate({ scale: 1 }, 200);
  $(`#eventdiv`).animate({ "opacity": "1" }, { durration: 400 });
  $(`#eventdiv`).CSSAnimate({ scale: 1 }, 200);
}

async function loopSide(winners, data) {
  let side = winners ? 'w' : 'l';
  for (let [roundCount, roundIndex] of Object.keys(data).entries()) {
    let round = data[roundIndex];
    for (let [gameCount, gameIndex] of Object.keys(round).entries()) {
      let game = round[gameIndex];
      if (!$(`#${side}${roundCount} .round-text`).is(':animated')) {
        $(`#${side}${roundCount} .round-text`).animate({ "opacity": "1" }, { durration: 400 });
        $(`#${side}${roundCount} .round-text`).CSSAnimate({ scale: 1 }, 400);
      }
      setTimeout(function () {
        $(`.${side}${roundCount}${gameCount}-lines`).animate({ "opacity": "1" }, { durration: 400 });
      }, 200);
      for (let [slotId, slot] of game.slots.entries()) {
        if (slot.entrant != null) {
          if (slot.entrant.participants.length == 1) {
            if ("prefix" in slot.entrant.participants[0] && slot.entrant.participants[0].prefix !== null) {
              $(`#${side}${roundCount}${gameCount}${slotId}team`).text(`${slot.entrant.participants[0].prefix} `);
            }
            if ("gamerTag" in slot.entrant.participants[0]) {
              $(`#${side}${roundCount}${gameCount}${slotId}tag`).text(slot.entrant.participants[0].gamerTag);
            } else {
              $(`#${side}${roundCount}${gameCount}${slotId}tag`).text(slot.entrant.name);
            }
            if (slot.entrant.participants[0].player.user != null && slot.entrant.participants[0].player.user.location != null) {
              let countryCode = getCountryCode(slot.entrant.participants[0].player.user.location.countryId);
              if (await countryCode != null) {
                $(`#${side}${roundCount}${gameCount}${slotId}country`).css('background-image', `url(assets/startgg/country/${(await countryCode).toLowerCase()}.svg)`);
              }
            }
          } else {
            $(`#${side}${roundCount}${gameCount}${slotId}tag`).text(slot.entrant.name);
          }
        } else {
          $(`#${side}${roundCount}${gameCount}${slotId}tag`).text('TBA');
        }
        while ($(`#${side}${roundCount}${gameCount}${slotId}span`).width() > 207) {
          let fontSize = parseInt($(`#${side}${roundCount}${gameCount}${slotId}span`).css("font-size"));
          fontSize = fontSize - 1;
          $(`#${side}${roundCount}${gameCount}${slotId}span`).css({ 'font-size': fontSize });
        }
        if (slot.standing != null) {
          $(`#${side}${roundCount}${gameCount}${slotId}score`).text(slot.standing.stats.score.displayValue);
        }
        setTimeout(function () {
          if (!$(`#${side}${roundCount}${gameCount}${slotId}`).is(':animated')) {
            $(`#${side}${roundCount}${gameCount}${slotId}`).CSSAnimate({ scale: 1 }, 400);
            $(`#${side}${roundCount}${gameCount}${slotId}`).animate({ opacity: 1 }, 400);
          }
        }, 200);
      }
    }
  }
}

async function getMetadata(phaseId) {
  const query = `
    query LosersStanding{
        phase(id: ${phaseId}){
          name
          bracketType
          event{
            name
            phases{
              id
            }
            tournament{
              name
            }
          }
        }
      }
    `

  let data = fetch('https://api.start.gg/gql/alpha',
    {
      method: 'post',
      headers: { 'Content-Type': 'application/json', "Authorization": `Bearer ${piio.cache.scoreboard.smashggtoken}` },
      body: JSON.stringify({
        query: query
      }),
    });
  return (await data).json();
}


async function getLosers(phaseId) {
  const query = `
    query LosersStanding{
        phase(id: ${phaseId}){
            sets(
              filters: {hideEmpty: false}
              page: 1
              perPage: ${losersSetAmount}
              sortType: ROUND
            ) {
              pageInfo {
                total
              }
              ${nodes}
            }
        }
      }
    `

  let data = fetch('https://api.start.gg/gql/alpha',
    {
      method: 'post',
      headers: { 'Content-Type': 'application/json', "Authorization": `Bearer ${piio.cache.scoreboard.smashggtoken}` },
      body: JSON.stringify({
        query: query
      }),
    })
  return (await data).json();
}

async function getWinners(phaseId, totalEntries) {
  let perPage = winnersSetAmount;
  let fertig = false;
  while (!fertig) {
    if (totalEntries % perPage == 0 || totalEntries % perPage >= winnersSetAmount || perPage >= totalEntries) {
      fertig = true;
    } else {
      perPage++;
    }
  }
  let page = Math.ceil(totalEntries / perPage);
  const query = await ` 
    query LosersStanding{
        phase(id: ${phaseId}){
            sets(
              filters: {hideEmpty: false}
              page: ${page}
              perPage: ${perPage}
              sortType: ROUND
            ) {
              ${nodes}
            }
        }
      }
    `
  let data = fetch('https://api.start.gg/gql/alpha',
    {
      method: 'post',
      headers: { 'Content-Type': 'application/json', "Authorization": `Bearer ${piio.cache.scoreboard.smashggtoken}` },
      body: JSON.stringify({
        query: query
      }),
    })
  return (await data).json();
}
const nodes = `
nodes {
  id
  lPlacement
  fullRoundText
  displayScore
  round
  state
  games {
    stage {
      id
    }
  }
  slots (includeByes: true) {
    entrant {
      initialSeedNum
      name
      participants {
        gamerTag
        prefix
        player {
          user {
            location {
              id
              countryId
              country
              city
              state
            }
            genderPronoun
          }
        }
      }
    }
    standing {
      metadata
      stats {
        score {
          label
          displayValue
          value
        }
      }
    }
  }
}`;
