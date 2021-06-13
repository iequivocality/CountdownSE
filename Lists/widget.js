const items = [];
let hidden = false;
let addToListCommand, resetListCommand, removeFromListCommand, toggleListCommand, listDisplayInitial,
    hideListAnimationStyle, showListAnimationStyle, showListAnimationTiming, hideListAnimationTiming,
    addingAnimationStyle, addingAnimationTiming, removingAnimationStyle, removingAnimationTiming;
let listItemHeight;

window.addEventListener('onWidgetLoad', function (obj) {
    let fieldData = obj.detail.fieldData;
    console.log("fieldData", fieldData)
    addToListCommand = fieldData.addToListCommand;
    resetListCommand = fieldData.resetListCommand;
    removeFromListCommand = fieldData.removeFromListCommand;
    toggleListCommand = fieldData.toggleListCommand;
    listDisplayInitial = fieldData.listDisplayInitial;
    hideListAnimationStyle = fieldData.hideListAnimationStyle;
    showListAnimationStyle = fieldData.showListAnimationStyle;
    showListAnimationTiming = fieldData.showListAnimationTiming;
    hideListAnimationTiming = fieldData.hideListAnimationTiming;

    listItemHeight = fieldData.listItemHeight;

    if (listDisplayInitial === "hide") {
        let listContainer = document.querySelector('.list-container');
        listContainer.style.marginLeft = '150%';
    }
});

window.addEventListener('onEventReceived', function (obj) {
    if (obj.detail.listener !== "message") return;
    
    let data = obj.detail.event.data;
    let badges = getBadges(data.badges);
    let message = data.text.trim();
    let splitMessage = message.split(' ');
    let command = splitMessage[0].toLowerCase();
    let value = splitMessage[1];

	if (command === addToListCommand && isModeratorOrBroadcaster(badges)) {
        let listContent = document.querySelector('.list-content');
    	let itemValue = splitMessage.splice(1, splitMessage.length - 1).join(' ');
        let identifier = "item-" + items.length;
        
        listContent.appendChild(createListElement(itemValue, identifier));
        items.push(itemValue);
        anime({
            targets: "." + identifier,
            delay: 1000,
            easing: "easeInOutQuad",
            marginLeft: '0px',
            duration: 1000
        });
    }
  	else if (command === resetListCommand && isModeratorOrBroadcaster(badges)) {
        let listContent = document.querySelector('.list-content');
        anime({
            targets: '.list-item',
            marginLeft: '150%',
            delay: anime.stagger(50),
            complete: function (anim) {
                items.length = 0;
                listContent.innerHTML = '';
            }
        });
    }
  	else if (command === removeFromListCommand && isModeratorOrBroadcaster(badges)) {
        if (items.length == 0) return;
        try {
            let itemValue = splitMessage.splice(1, splitMessage.length - 1).join(' ');
            let indexForRemoval = items.findIndex((val, index) => index === (parseInt(value) - 1) || val == itemValue);
            if (indexForRemoval > -1) {
                anime({
                    targets: '.item-' + indexForRemoval,
                    marginLeft: '150%',
                    easing: "easeInOutQuad",
                    delay: anime.stagger(100),
                    complete: function (anim) {
                        document.querySelector('.item-' + indexForRemoval).remove();
                        
                        let timeline = anime.timeline({ duration: 300 });
                        for (let afterIndex = indexForRemoval + 1; afterIndex < items.length; afterIndex++) {
                            let afterItem = document.querySelector('.item-' + (afterIndex));
                            afterItem.classList.remove('item-' + (afterIndex));
                            afterItem.classList.add('item-' + (afterIndex - 1));

                            timeline.add({
                                targets: '.item-' + (afterIndex - 1),
                                translateY: (listItemHeight * -1) + "px"
                            });
                        }
                        items.splice(indexForRemoval, 1);
                    }
                });
            }
        }
        catch (err) {}
    }
    else if (command === toggleListCommand && isModeratorOrBroadcaster(badges)) {
        let animationStyle = hidden ? showListAnimationStyle : hideListAnimationStyle;
        let timing = hidden ? showListAnimationTiming : hideListAnimationTiming;
        let propertyObject = getDestinationProperty(animationStyle, timing);
        console.log("propertyObject", propertyObject);

        if (hidden && animationStyle != "fade") {
            document.querySelector('.list-container').style.opacity = 1;
        }

        anime({
            targets: '.list-container',
            complete: function (anim) {
                hidden = false;
            },
            ...propertyObject
        });

        // if (hidden) {
        //     //immediately set opacity to 1 when animationStyle is not fade
        //     if (hidden && animationStyle != "fade") {
        //         document.querySelector('.list-container').style.opacity = 1;
        //     }

        //     anime({
        //         targets: '.list-container',
        //         complete: function (anim) {
        //             hidden = false;
        //         },
        //         ...propertyObject
        //     });
        // }
        // else {
        //     anime({
        //         targets: '.list-container',
        //         // marginLeft: '150%',
        //         complete: function (anim) {
        //             hidden = true;
        //         },
        //         ...propertyObject
        //     });
        // }
    }
});

function getDestinationProperty(animationStyle, easing) {
    if (animationStyle == "slideUp") {
        return { marginBottom: hidden ? '0%' : '150%', easing: easing };
    } else if (animationStyle == "slideDown") {
        return { marginTop: hidden ? '0%' : '150%', easing: easing };
    } else if (animationStyle == "slideLeft") {
        return { marginRight: hidden ? '0%' : '150%', easing: easing };
    } else if (animationStyle == "slideRight") {
        return { marginLeft: hidden ? '0%' : '150%', easing: easing };
    } else if (animationStyle == "fade") {
        return { opacity: hidden ? 1 : 0, easing: easing };
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

function createListElement(value, identifier) {
    let listItem = document.createElement('div');
    listItem.className = "list-item " + identifier;
    listItem.innerHTML = value;
    listItem.style.top = (listItemHeight * (items.length)) + 'px';
    return listItem;
}

function getBadges(badges) {
    return badges.map(function(val){
        return val.type;
    }); 
}