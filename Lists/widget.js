let addToListCommand, 
    resetListCommand, 
    removeFromListCommand;

window.addEventListener('onEventReceived', function (obj) {
    if (obj.detail.listener !== "message") return;
    
    let data = obj.detail.event.data;
    let badges = getBadges(data.badges);
    let message = data.text.trim().toLowerCase();
    let splitMessage = message.split(' ');
    let command = splitMessage[0];
    let value = splitMessage[1];


});

window.addEventListener('onWidgetLoad', function (obj) {
    let fieldData = obj.detail.fieldData;
    addToListCommand = fieldData.addToListCommand;
    resetListCommand = fieldData.resetListCommand;
    removeFromListCommand = fieldData.removeFromListCommand;
});

function getBadges(badges) {
    return badges.map(function(val){
        return val.type;
    }); 
}