let hideAfter = 60;
let hidden = true;
let hideAnimation, hideDelay, pollCommand;
let totalVotes = 0;
let currentOptions = [];
let currentVoters = [];
let votes = {};
let originAnimationStyle,destinationAnimationStyle;
let isMultipleVotingEnabled = false;

window.addEventListener('onEventReceived', function (obj) {
    if (obj.detail.listener !== "message") return;
    let data = obj.detail.event.data;
    let badges = getBadges(data.badges);
    let message = data.text.trim();
    let command = message.includes(' ') ? message.substr(0,message.indexOf(' ')).toLowerCase() : message.toLowerCase();
    let args = message.includes(' ') ? message.substr(message.indexOf(' ')+1) : undefined;
    console.log(message);
    console.log(badges);
    
  
    if(command === pollCommand  && (badges.includes("broadcaster") || badges.includes("moderator"))) {
      if(hidden) {
      	showPoll();
      }
      
      if (args) {
        let argList = args.split(",");
        let pollLabel = argList[0];
        currentOptions = argList.splice(1);
        
        createNewPoll(pollLabel);
      } else {
        hidePoll(); 
      }
    }
    else if(!hidden && currentOptions && !isNaN(message) && message > 0 && message <= currentOptions.length ) {
      let voter = obj.detail.event.data.nick;
      
      if(!isMultipleVotingEnabled && currentVoters.includes(voter)) return;
      
      currentVoters.push(voter);
      votes[message]++;
      totalVotes++;
      
      updateOptions();
      
      console.log("Votes: " + JSON.stringify(votes));
      console.log("Total votes: " + totalVotes);
    }
});

window.addEventListener('onWidgetLoad', function (obj) {
    console.log("LOADED WIDGET");
    let fieldData = obj.detail.fieldData;
  
    hideAnimation = fieldData.hideAnimation;
    hideDelay = fieldData.hideDelay;
    pollCommand = fieldData.pollCommand;
    isMultipleVotingEnabled = fieldData.isMultipleVotingEnabled;
  
    if(hideAnimation === "none") {
    	hidden = false; 
    }
  
    let mainContainerElement = document.querySelector('.main-container');
    if(hideAnimation === "slideRight") {
      mainContainerElement.style.marginLeft = "800px";
    }
    else if(hideAnimation === "slideLeft") {
      mainContainerElement.style.marginLeft = "-800px";
    }
    else if(hideAnimation === "slideDown") {
      mainContainerElement.style.marginTop = "800px";
    }
    else if(hideAnimation === "slideUp") {
      mainContainerElement.style.marginTop = "-800px";
    }
  
    setAnimationStyle(hideAnimation)
});

function createNewPoll(pollLabel) {
    totalVotes = 0;
    currentVoters = [];

    document.querySelector('.poll-label').innerHTML = pollLabel + ": ";

    initOptions();
}

function initOptions() {
    let optionsElement = document.querySelector(".poll-options");
    optionsElement.textContent = '';
  
    let ctr;
    for (ctr = 0; ctr < currentOptions.length && ctr < 5 ; ctr++) {
      let option = currentOptions[ctr];
      
      console.log("Option: " + option );
      
      votes[ctr+1] = 0;
      
      let optionElement = document.createElement("div");
      optionElement.className = "poll-option";
      
      let optionTextContainerElement = document.createElement("div");
      optionTextContainerElement.className = "poll-option-text-container";
      
      let optionTextElement = document.createElement("div");
      optionTextElement.className = "poll-option-text";
      
      let pollOptionResultElement = document.createElement("div");
      pollOptionResultElement.className = "poll-option-result"; 
      
      let pollOptionPercentageElement = document.createElement("div");
      pollOptionPercentageElement.className = "poll-option-percentage percentage-" + ctr;
      
      let pollBarElement = document.createElement("div");
      pollBarElement.className = "poll-bar";
      
      let pollTotalBarElement = document.createElement("div");
      pollTotalBarElement.className = "poll-total-bar progress-" + ctr;
      
      let optionText = document.createTextNode(option);
      let percentText = document.createTextNode("0% (0)");
      
      pollOptionPercentageElement.appendChild(percentText);
      pollBarElement.appendChild(pollTotalBarElement);
      pollOptionResultElement.appendChild(pollBarElement);
      pollOptionResultElement.appendChild(pollOptionPercentageElement);
      optionTextElement.appendChild(optionText);
      optionTextContainerElement.appendChild(optionTextElement);
      optionTextContainerElement.appendChild(pollOptionResultElement);
      optionElement.appendChild(optionTextContainerElement);
      optionsElement.appendChild(optionElement);
    }
}

function showPoll() {
  console.log("Show poll");
  if(hidden) {
    let timeline = anime.timeline({
      easing: 'easeOutExpo',
      duration: 1000
    });

    //after slide out, the new value is appended above the current value
    //the new value margin moves the current value down
    //current value is deleted and new value becomes current value

    timeline.add({
      ...originAnimationStyle,
      targets: '.main-container',
      complete: function(anim) {
        //do it here
        hidden = false;
      }
    });
  }
}

function hidePoll() {
    console.log("Hide poll " + hidden);
  if(!hidden) {
    let timeline = anime.timeline({
      easing: 'easeInExpo',
      duration: 1000
    });

    //after slide out, the new value is appended above the current value
    //the new value margin moves the current value down
    //current value is deleted and new value becomes current value

    timeline.add({
      ...destinationAnimationStyle,
      targets: '.main-container',
      complete: function(anim) {
        hidden = true;
      }
    });
  }
}

function updateOptions() {
    let ctr;
    for (ctr = 0; ctr < currentOptions.length && ctr < 5 ; ctr++) {
      let option = currentOptions[ctr];
      let percentage = Math.round(votes[ctr+1] / totalVotes * 100);

      let pollOptionPercentageElement = document.querySelector(".percentage-" + ctr);
      pollOptionPercentageElement.innerHTML = percentage + "% (" + votes[ctr+1] +")";
      
      let pollOptionProgressElement = document.querySelector(".progress-" + ctr);
      pollOptionProgressElement.style.width = percentage + "%";
    }
}

function setAnimationStyle(hideAnimation) {
  if(hideAnimation === "none") return;
  
  if(hideAnimation === "slideRight") {
    originAnimationStyle = {marginLeft:'0px'};
  	destinationAnimationStyle = {marginLeft:'800px'};
  }
  else if(hideAnimation === "slideLeft") {
    originAnimationStyle = {marginLeft:'0px'};
  	destinationAnimationStyle = {marginLeft:'-800px'};
  }
  else if(hideAnimation === "slideDown") {
    originAnimationStyle = {marginTop:'0px'};
  	destinationAnimationStyle = {marginTop:'800px'};
  }
  else if(hideAnimation === "slideUp") {
    originAnimationStyle = {marginTop:'0px'};
  	destinationAnimationStyle = {marginTop:'-800px'};
  }
}

function getBadges(badges) {
  return badges.map(function(val){
    return val.type;
  }) 
}