let startTime = 0;
let KEYS = ['Burst', '⬆️', 'Skill', '⬅️', '⬇️', '➡️'];
let KEYS_NO_SKILL = ['⬆️', '⬅️', '⬇️', '➡️'];
let skillsIncluded = false;
let animating = false;
let showWidget = false;
let toggleSkillRandomizeCommand = '', startInvertionCommand = '', showControlShuffleCommand = '', hideControlShuffleCommand = '';

window.addEventListener('onEventReceived', function (obj) {
    if (obj.detail.listener !== "message") return;
    let data = obj.detail.event.data;
    let badges = getBadges(data.badges);
    let message = data.text.trim().toLowerCase();

    if (message.startsWith('!') && !animating) {
        if (message == toggleSkillRandomizeCommand && isBroadcasterOrModerator(badges)) {
            skillsIncluded = !skillsIncluded;
        } else if (message == startInvertionCommand && isBroadcasterOrModerator(badges) && showWidget) {
            shuffleKeys(skillsIncluded ? KEYS : KEYS_NO_SKILL);
        } else if (message == showControlShuffleCommand) {
            showWidget = true;
            $('.keyboard').animate({opacity: 1}, 1500);
        } else if (message == hideControlShuffleCommand) {
            showWidget = false;
            $('.keyboard').animate({opacity: 0}, 1500);
        } 
    }
});

window.addEventListener('onWidgetLoad', function (obj) {
    let fieldData = obj.detail.fieldData;
    toggleSkillRandomizeCommand = fieldData.toggleSkillRandomizeCommand;
    startInvertionCommand = fieldData.startInvertionCommand;
    showControlShuffleCommand = fieldData.showControlShuffleCommand;
    hideControlShuffleCommand = fieldData.hideControlShuffleCommand
});

function shuffleKeys(keys) {
    window.requestAnimationFrame(function (timestamp) {
        animating = true;
        startTime = timestamp || new Date().getTime();
        shuffleKeysAnimation(timestamp, keys, 5000)
    }) 
}

function shuffleKeysAnimation(timestamp, keys, duration) {
    let newTimestamp = timestamp || new Date().getTime();
    let runtime = newTimestamp - startTime;

    let shuffledKeys = shuffleArray(keys);
    if (skillsIncluded) {
        setKeyContent('qKey', shuffledKeys[0]);
        setKeyContent('wKey', shuffledKeys[1]);
        setKeyContent('eKey', shuffledKeys[2]);
        setKeyContent('aKey', shuffledKeys[3]);
        setKeyContent('sKey', shuffledKeys[4]);
        setKeyContent('dKey', shuffledKeys[5]);
    } else {
        setKeyContent('wKey', shuffledKeys[0]);
        setKeyContent('aKey', shuffledKeys[1]);
        setKeyContent('sKey', shuffledKeys[2]);
        setKeyContent('dKey', shuffledKeys[3]);
    }

    if (runtime < duration){
        window.requestAnimationFrame(function(timestamp) {
            shuffleKeysAnimation(timestamp, keys, duration)
        });
    } else {
        animating = false;
    }
}

function setKeyContent(className, newValue) {
    $('.' + className + ' .keyPurpose').text(newValue);
}

function shuffleArray(array) {
    let curId = array.length;
    while (0 !== curId) {
      let randId = Math.floor(Math.random() * curId);
      curId -= 1;

      let tmp = array[curId];
      array[curId] = array[randId];
      array[randId] = tmp;
    }
    return array;
}

function isBroadcasterOrModerator(badges) {
    return badges.includes("broadcaster") || badges.includes("moderator");
}

function getBadges(badges) {
  return badges.map(function(val){
    return val.type;
  }) 
}