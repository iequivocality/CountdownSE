let streamerHealth = 100;
let maxHealth = 100;
let previousHealth = 100;
let followerRegen = 0, subRegen = 0, cheerRegen = 0, tipRegen = 0, raidRegen = 0; //Health points
let damageAmount = 0, damageTimer = 0; //DMG data
let startTakingDamageCMD = '', stopTakingDamageCMD = '', toFullHealthCMD = '';//commands
let shouldTakeDMG = false;
let provider = "twitch";
let label = "";
let lickCooldown = 15000;
let allowLick = true;

window.addEventListener('onWidgetLoad', function (obj) {
    const data = obj.detail.fieldData;
    followerRegen = data.latestFollowerPoints;
    subRegen = data.latestSubscriberPoints;
    cheerRegen = data.latestCheerPoints;
    tipRegen = data.latestTipPoints;
    raidRegen = data.latestRaidPoints;

    damageAmount = data.damageAmount;
    damageTimer = data.damageTimer;

    streamerHealth = data.startingHealth;
    startTakingDamageCMD = data.startTakingDamageCMD;
    stopTakingDamageCMD = data.stopTakingDamageCMD;
    toFullHealthCMD = data.toFullHealthCMD;

    fetch('https://api.streamelements.com/kappa/v2/channels/' + obj.detail.channel.id + '/').then(response => response.json()).then((profile) => {
        provider = profile.provider;
    });

    setInterval(takeDamage, damageTimer * 1000);
    refreshView();
});

window.addEventListener('onEventReceived', function (obj) {
    let listener = obj.detail.listener;
    let data = obj.detail.event.data;

    if (listener == "message") {
        let message = data.text.trim();
        let badges = getBadges(data.badges);
        processCommands(message, badges);
        return;
    }

    regenerateHealth(listener, data);

});

function takeDamage() {
    if (shouldTakeDMG) {
        previousHealth = streamerHealth;
        if (streamerHealth - damageAmount < 0) {
            streamerHealth = 0;
        } else {
            streamerHealth -= damageAmount;
        }
        refreshView();
    }
}

function regenerateHealth(listener, data) {
    previousHealth = streamerHealth;
    if (listener == "follower-latest") {
        streamerHealth += followerRegen;
    } else if (listener == "subscriber-latest") {
        streamerHealth += subRegen;
    } else if (listener == "cheer-latest") {
        streamerHealth += cheerRegen;
    } else if (listener == "tip-latest") {
        streamerHealth += tipRegen;
    } else if (listener == "raid-latest") {
        streamerHealth += raidRegen;
    }
    refreshView();
}

function refreshView() {
    let updateObject = {
        health : previousHealth
    }

    anime({
        targets: updateObject,
        health: streamerHealth,
        easing: 'easeInQuad',
        round: 1,
        begin: function(anim) {
            shouldTakeDMG = false;
        },
        complete: function(anim) {
            shouldTakeDMG = true;
        },
        update: function() {
            let totalPercentage = (updateObject.health / maxHealth) * 100;
            let remHealthElement = document.querySelector('.remaining-health');
            let numberHealth = document.querySelector('.number-health');
            remHealthElement.style.width = `${totalPercentage}%`;
            numberHealth.innerHTML = `${totalPercentage}%`;
        }
    });
}

function processCommands(message, badges) {
    if (message.startsWith('!') && isModeratorOrBroadcaster(badges)) {
        if (message == startTakingDamageCMD) {
            shouldTakeDMG = true;
        } else if (message == stopTakingDamageCMD) {
            shouldTakeDMG = false;
        } else if (message == toFullHealthCMD) {
            streamerHealth = 100;
            refreshView();
        } else if (message == '!lick') {
            if (Math.random() == 1) {
                streamerHealth -= 1;
                allowLick = false;
                setTimeout(() => {
                    allowLick = true;
                }, lickCooldown);
            }
        }
    }
}


function isModeratorOrBroadcaster(badges) {
	return badges.includes("broadcaster") || badges.includes("moderator");
}

function getBadges(badges) {
    return badges.map(function(val){
        return val.type;
    }); 
}