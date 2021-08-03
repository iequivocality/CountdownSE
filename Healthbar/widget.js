let eventQueue = [];

let streamerHealth = 100;
let maxHealth = 100;
let previousHealth = 100;
let followerRegen = 0, subRegen = 0, cheerRegen = 0, tipRegen = 0, raidRegen = 0; //Health points
let damageAmount = 0, damageTimer = 0, lickDamageAmount = 0; //DMG data
let startTakingDamageCMD = '', stopTakingDamageCMD = '', toFullHealthCMD = '';//commands
let shouldTakeDMG = false;
let animating = false;
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
    lickDamageAmount = data.lickDamageAmount;

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
    let event = obj.detail.event;

    if (!isValidEvent(listener)) {
        return;
    }

    eventQueue.push({ listener : listener, event : event });
    parseQueue();
});

function isValidEvent(listener) {
    return listener == "message" || listener == "follower-latest" || listener == "subscriber-latest" || listener == "cheer-latest"
        || listener == "tip-latest" || listener == "raid-latest";
}

function healthbar(listener, event) {
    if (listener == "message") {
        let data = event.data;
        let message = data.text.trim();
        let badges = getBadges(data.badges);
        processCommands(message, badges, data.channel, data.nick);
        return;
    }

    regenerateHealth(listener, event);
    parseQueue();
}

function parseQueue() {
    if (animating) {
        return;
    }
    if (eventQueue.length == 0) {
        return;
    }
    let item = eventQueue.shift();
    console.log("parseQueue", item)
    healthbar(item.listener, item.event);
}

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

function regenerateHealth(listener, event) {
    console.log("regenerateHealth", event);
    previousHealth = streamerHealth;
    if (listener == "follower-latest") {
        label = `New Follower (+${followerRegen})`;
        streamerHealth += followerRegen;
    } else if (listener == "subscriber-latest") {
        if (event.bulkGifted) {
            streamerHealth += subRegen * event.amount;
            label = `Gifted Subs (+${subRegen} * ${event.amount})`;
        }
        else {
            streamerHealth += subRegen;
            label = `New Subscriber (+${subRegen})`;
        }
    } else if (listener == "cheer-latest") {
        streamerHealth += cheerRegen;
        label = `New Cheer - ${event.amount} bits (+${cheerRegen})`;
    } else if (listener == "tip-latest") {
        streamerHealth += tipRegen;
        label = `New Tip (+${tipRegen})`;
    } else if (listener == "raid-latest") {
        streamerHealth += raidRegen;
        label = `Raid Alert (+${raidRegen})`;
    }
    refreshView();
}

function refreshView() {
    let updateObject = {
        health : previousHealth
    }

    // let eventsElement = document.querySelector('.events');
    // eventsElement.innerText = label;

    $('.events-marquee span').text(label);

    anime({
        targets: updateObject,
        health: streamerHealth,
        easing: 'easeInQuad',
        round: 1,
        begin: function(anim) {
            animating = true;
        },
        complete: function(anim) {
            animating = false;
        },
        update: function() {
            let totalPercentage = Math.ceil(updateObject.health / maxHealth * 100);
            let remHealthElement = document.querySelector('.remaining-health');
            remHealthElement.classList.remove('beyond-health');
            remHealthElement.classList.remove('stable-health');
            remHealthElement.classList.remove('moderate-health');
            remHealthElement.classList.remove('critical-health');

            let healthbar = document.querySelector('.healthbar');
            healthbar.classList.remove('critical-healthbar');

            if (totalPercentage > 100) {
                remHealthElement.classList.add('beyond-health');
            } else if (totalPercentage >= 50) {
                remHealthElement.classList.add('stable-health');
            } else if (totalPercentage >= 30) {
                remHealthElement.classList.add('moderate-health');
            } else if (totalPercentage >= 0) {
                remHealthElement.classList.add('critical-health');
                
                healthbar.classList.add('critical-healthbar');
            }

            remHealthElement.style.width = `${totalPercentage}%`;

            let numberHealth = document.querySelector('.number-health');
            numberHealth.innerHTML = `${totalPercentage}%`;
        }
    });
}

function processCommands(message, badges, channel, nick) {
    if (message.startsWith('!')) {
        if (message == '!lick') {
            lick(channel, nick);
        } else if (isModeratorOrBroadcaster(badges)) {
            if (message == startTakingDamageCMD) {
                shouldTakeDMG = true;
            } else if (message == stopTakingDamageCMD) {
                shouldTakeDMG = false;
            } else if (message == toFullHealthCMD) {
                previousHealth = streamerHealth;
                streamerHealth = 100;
                refreshView();
            }
        }
    }
}

function lick(channel, nick) {
    if (allowLick && Math.floor(Math.random() * 100) > 66) {
        streamerHealth -= lickDamageAmount;
        allowLick = false;
        label = 'Somebody licked me ;_; (-' + lickDamageAmount + ')';

        refreshView();

        setTimeout(() => {
            allowLick = true;
        }, lickCooldown);
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