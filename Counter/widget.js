let hideAfter = 60;
let hidden = false;
let counter = 0;
let previousCounter = 0;
let values = {
  counter, 
  previousCounter
};
let hideAnimation, hideDelay, counterCommand, counterAddCommand, counterSubtractCommmand, counterResetCommand, initialCounterValue, animationDuration,
  changeCounterAudio, labelType, counterLabel, audioDelay, volumeSlider;
let enableAudio = false;
let originAnimationStyle, destinationAnimationStyle;

window.addEventListener('onEventReceived', function (obj) {
    if (obj.detail.listener !== "message") return;
    let data = obj.detail.event.data;
    let badges = getBadges(data.badges);
    let message = data.text.trim().toLowerCase();
    let splitMessage = message.split(' ');
    let command = splitMessage[0];
    let value = splitMessage[1];
    console.log(badges);
  
    if(command === counterCommand) {
      if (value !== undefined && (badges.includes("broadcaster") || badges.includes("moderator"))) {
        let parsed = 0;
        try {
          parsed = parseInt(value);
        } catch (err) {
          parsed = 0;
        }
        setCounter(parsed);
        showCounterIfHidden(counter);
      }
      else {
        showCounterIfHidden();
      }
    }
  
   else if(command === counterAddCommand && (badges.includes("broadcaster") || badges.includes("moderator"))) {
     console.log("Adding to counter.");
     setCounter(counter + 1);
     showCounterIfHidden(counter);
   }
  
   else if(command === counterSubtractCommand && (badges.includes("broadcaster") || badges.includes("moderator"))) {
     console.log("Subtracting from counter.");
     if(counter > 0) {
      setCounter(counter - 1);
     };
     showCounterIfHidden(counter);
   }
   
   else if(command === counterResetCommand && (badges.includes("broadcaster") || badges.includes("moderator"))) {
     console.log("Resetting counter.");
     setCounter(0);
     showCounterIfHidden(counter);
   }
});

function setCounter(newCounter) {
  previousCounter = counter;
  counter = newCounter;
}

function setCounterText (counter) {
  document.querySelector('.newCounter').innerHTML = counter;
  let timeline = anime.timeline();
  if (enableAudio) {
    if (audioDelay > 0) {
      setTimeout(function () {
        playAudio(changeCounterAudio, volumeSlider);
      }, audioDelay * 1000);
    } else {
      playAudio(changeCounterAudio, volumeSlider);
    }
    
  }
  
  timeline.add({
    targets: '.currentCounter',
    marginTop: '-65px',
    easing: 'easeInExpo',
    complete: function(anim) {
      document.querySelector('.currentCounter').innerHTML = counter;
      let currentCounterElement = document.querySelector('.currentCounter');
      currentCounterElement.style.marginTop = "0px";
  }});
}

window.addEventListener('onWidgetLoad', function (obj) {
    console.log("LOADED WIDGET");
    let fieldData = obj.detail.fieldData;
  
    hideAnimation = fieldData.hideAnimation;
    hideDelay = fieldData.hideDelay;
    counterCommand = fieldData.counterCommand;
    counterAddCommand = fieldData.counterAddCommand;
    counterSubtractCommand = fieldData.counterSubtractCommand;
    counterResetCommand = fieldData.counterResetCommand;
    initialCounterValue = fieldData.initialCount;
    animationDuration = fieldData.animationDuration;
    changeCounterAudio = fieldData.changeCounterAudio;
    audioDelay = fieldData.audioDelay;
    volumeSlider = fieldData.volumeSlider;
    labelType = fieldData.labelType;
    counterLabel = fieldData.counterLabel;
    labelImage = fieldData.labelImage;


    if(hideAnimation === "none") {
    	hidden = false; 
    }

    setCounter(initialCounterValue);
    setCounterText(initialCounterValue);
    setAnimationStyle(hideAnimation);
    let counterContainerElement = document.querySelector('.counter-container');
    if(hideAnimation === "slideRight") {
      counterContainerElement.style.marginLeft = "500px";
    }
    else if(hideAnimation === "slideLeft") {
      counterContainerElement.style.marginLeft = "-500px";
    }
    else if(hideAnimation === "slideDown") {
      counterContainerElement.style.marginTop = "500px";
    }
    else if(hideAnimation === "slideUp") {
      counterContainerElement.style.marginTop = "-500px";
    }

    if (labelType == "showImage") {
      $('.counter-image').attr('src', labelImage);
    } else {
      $('.counter-text').text(counterLabel);
    }

    enableAudio = fieldData.enableAudio == "yes";
});

function showCounterIfHidden(counter) {
  if (!hidden && counter !== undefined && !isNaN(counter)) {
    setCounterText(counter);
  }
  
  if(hideAnimation !== "none" && hidden) {
    let timeline = anime.timeline({});

    //after slide out, the new value is appended above the current value
    //the new value margin moves the current value down
    //current value is deleted and new value becomes current value

    timeline.add({
      ...originAnimationStyle,
      targets: '.counter-container',
      easing: 'easeOutExpo',
      duration: animationDuration,
      complete: function(anim) {
        //do it here
        hidden = false;
        if (counter !== undefined && !isNaN(counter)) {
          setCounterText(counter);
        }
      }
    }).add({
      ...destinationAnimationStyle,
      targets: '.counter-container',
      delay: hideDelay,
      easing: 'easeInExpo',
      duration: animationDuration,
      complete: function(anim) {
        hidden = true;
      }
    });
  }
}

function setAnimationStyle(hideAnimation) {
  if(hideAnimation === "none") return;
  
  if(hideAnimation === "slideRight") {
    originAnimationStyle = {marginLeft:'0px'};
  	destinationAnimationStyle = {marginLeft:'500px'};
  }
  else if(hideAnimation === "slideLeft") {
    originAnimationStyle = {marginLeft:'0px'};
  	destinationAnimationStyle = {marginLeft:'-500px'};
  }
  else if(hideAnimation === "slideDown") {
    originAnimationStyle = {marginTop:'0px'};
  	destinationAnimationStyle = {marginTop:'500px'};
  }
  else if(hideAnimation === "slideUp") {
    originAnimationStyle = {marginTop:'0px'};
  	destinationAnimationStyle = {marginTop:'-500px'};
  }
}

function getBadges(badges) {
  return badges.map(function(val){
    return val.type;
  }) 
}

function playAudio(sound, volume) {
  let audio = new Audio(sound);
  audio.volume = volume * .01;
  audio.play();
  return audio.duration;
}