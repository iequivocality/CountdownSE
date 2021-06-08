let hideAfter = 60;
let hidden = true;
let counter = 0;
let hideAnimation, hideDelay, counterCommand, counterAddCommand, counterSubtractCommmand, counterResetCommand, counterSetCommand;
let originAnimationStyle,destinationAnimationStyle;

window.addEventListener('onEventReceived', function (obj) {
    if (obj.detail.listener !== "message") return;
    let data = obj.detail.event.data;
    let badges = getBadges(data.badges);
    let message = data.text;
    console.log(badges);
  
    if(message.toLowerCase() === counterCommand) {
      showCounterIfHidden();
    }
  
   else if(message.toLowerCase() === counterAddCommand && (badges.includes("broadcaster") || badges.includes("moderator"))) {
     console.log("Adding to counter.");
     counter+=1;
     $(".counter").text(counter);
     showCounterIfHidden();
   }
  
   else if(message.toLowerCase() === counterSubtractCommmand && (badges.includes("broadcaster") || badges.includes("moderator"))) {
     console.log("Subtracting from counter.");
     if(counter > 0) counter-=1;
     $(".counter").text(counter);
     showCounterIfHidden();
   }
   
   else if(message.toLowerCase() === counterResetCommand && (badges.includes("broadcaster") || badges.includes("moderator"))) {
     console.log("Resetting counter.");
     counter = 0;
     $(".counter").text(counter);
     showCounterIfHidden();
   }
  
  else if(message.toLowerCase().startsWith(counterSetCommand) && (badges.includes("broadcaster") || badges.includes("moderator"))) {
     console.log("Setting counter to " + message.split(" ")[1]);
     if( !isNaN(message.split(" ")[1])) counter = parseInt(message.split(" ")[1]);
     $(".counter").text(counter);
     showCounterIfHidden();
   }
});

window.addEventListener('onWidgetLoad', function (obj) {
    console.log("LOADED WIDGET");
    let fieldData = obj.detail.fieldData;
  
    hideAnimation = fieldData.hideAnimation;
    hideDelay = fieldData.hideDelay;
    counterCommand = fieldData.counterCommand;
    counterAddCommand = fieldData.counterAddCommand;
    counterSubtractCommand = fieldData.counterSubtractCommand;
    counterResetCommand = fieldData.counterResetCommand;
    counterSetCommand = fieldData.counterSetCommand;
  
    setAnimationStyle(hideAnimation);
});

function showCounterIfHidden() {
  if(hideAnimation !== "none" && hidden) {
    $('.main-container').animate(originAnimationStyle, function(){
      hidden = false;
    });
    $('.main-container').delay(hideDelay).animate(destinationAnimationStyle, function(){
      hidden = true;
    });
  }  
}

function setAnimationStyle(hideAnimation) {
  if(hideAnimation === "none") return;
  
  if(hideAnimation === "slideRight") {
    originAnimationStyle = {marginLeft:'0'};
  	destinationAnimationStyle = {marginLeft:'500'};
  }
  else if(hideAnimation === "slideLeft") {
    originAnimationStyle = {marginLeft:'0'};
  	destinationAnimationStyle = {marginLeft:'-500'};
  }
  else if(hideAnimation === "slideDown") {
    originAnimationStyle = {marginTop:'0'};
  	destinationAnimationStyle = {marginTop:'500'};
  }
  else if(hideAnimation === "slideUp") {
    originAnimationStyle = {marginTop:'0'};
  	destinationAnimationStyle = {marginTop:'-500'};
  }
}

function getBadges(badges) {
  return badges.map(function(val){
    return val.type;
  }) 
}