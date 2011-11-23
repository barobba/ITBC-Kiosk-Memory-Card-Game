/* Author: 

*/

$(document).ready(function () {
  
  var packID = getParameterByName('pack');
	var deck = "packs_cards/"+packID+"/";

	$.getJSON(deck + "_data.json",
		function(cards) {

      $('.ajax-loader-icon').remove();
	  
	    cards = cards.cards;
			var img_src, aud_src, id;

			// Create the DECK
			var allcards = [];
      // Add all the cards
			for(card in cards) {
				allcards.push(cards[card]);
			}
			// Shuffle the deck
			allcards = $.shuffle(allcards);
      // Pick just the top 10 cards
      allcards = allcards.slice(0, 10);
      // Duplicate the cards in the deck
      allcards = allcards.concat(allcards);

			// Layout the cards on the game board 
			$.each(allcards, function(key, val) {
			  
				//img_src = val.pictureURL;
			  img_src = 'packs_cards/' + packID + '/' + val.pictureFilename;
				
				id = val.text.example.audioID;
				aud_src = val.text.example.audioID;
				word = val.text.example.text;

				// Back of card
				$('<dt class="card back" data-word="'+ word +'" id="'+id+'"><img src="img/back_of_card.png" alt="" /></dt>')
				.click(function() {
				  
				  // ALL THE CARDS START WITH THE CLICKING BEING HANDLED BY THE "FLIP CARD" FUNCTION  
				  clickProxy(this, function(card){
	          flipCard(card); 
				  });
				  
				}).appendTo("#game");
				
				// Front of card
				$('<dd class="card front" id="'+id+'_flip"><img src="' + img_src +'" alt="" /><audio id="' + id + '_audio" preload="auto"><source src="' + deck + aud_src + '.ogg" type="audio/ogg" /></audio></dt>')
				.appendTo("#game");
				
			});
			
			// For some reason, remove the first element...
			// TODO: Track down where this bug is coming from, so we can get rid of this special case.
			$('#game').children().first().remove();
      			
		});
});

/**
 * Click handler decides whether or not to perform click action
 * @return
 */
function clickProxy(selector, method) {
  var flipped_cards = $(".flipped");
  if(flipped_cards.length < 2) {
    method($(selector));
  }
}

function flipCard(el) {
  
	var new_id = el.attr("id") + "_flip";
	var aud_id = el.attr("id") + "_audio";

	// This card is considered flipped from the very beginning
	// Because it has passed through the clickProxy() filter,
	// Which only allows flipCard to run if there are less than 2 cards flipped.
  el.addClass("flipped");
	

  // Start the flip
	el.flip({
		direction: "lr",
		color: "white",
		content: $('#' + new_id),
  	
  	// When the flip is finished, then start playing the audio 
		onEnd: function() {
	  
      if (el.hasClass('flipped')) {
        document.getElementById(aud_id).play();
      }
	  
	    var flipped_cards = $(".flipped");
	    if(flipped_cards.length >= 2) {
	      // Make sure audio will stop when finished playing
	      // If this is the second flip, then also check for a match
	      // When the audio is finished playing
	      document.getElementById(aud_id).addEventListener('ended', function() {
	        checkForMatch();
	        checkForWin();
	      }, false);
        
	    }
	    
	    // Not sure what 'transparent' represents...we may not need it.
			//if(this.bgColor === "transparent") {
			//	document.getElementById(aud_id).play();
			//}
		}
	});

	// Let the application flip the cards back, based on matches
	//el.click(function() { revertCard(el); });
	
}





function resetAudio(audio_id) {
	document.getElementById(audio_id).pause();
  document.getElementById(audio_id).currentTime = 0;
}

function checkForMatch() {
  
	var flipped_cards = $(".flipped");
	if($(flipped_cards[0]).data("word") == $(flipped_cards[1]).data("word")) {
	  
	  // Mark the cards as matched
		flipped_cards.each(function(key, val) {
			$(this).removeClass("flipped").addClass("matched");
		});

	} else {
	  
    // Flip the cards back over
    flipped_cards.each(function(key, val) { 
      $(this).removeClass("flipped");
      $(this).revertFlip({
        onEnd: function(){}
      });
    });
    
	}
	
}

function checkForWin() {
	var cards = $("#game dd");
	if(cards.length - 1 === $(".matched").length) {
	  alert('Congratulations, you matched all the cards!');
		location.reload(true);
	}
}



/**
 * Returns a query string value from the page URL, given the name.
 * 
 * @param name
 * @return
 */
function getParameterByName(name)
{
  name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
  var regexS = "[\\?&]" + name + "=([^&#]*)";
  var regex = new RegExp(regexS);
  var results = regex.exec(window.location.href);
  if(results == null)
    return "";
  else
    return decodeURIComponent(results[1].replace(/\+/g, " "));
}


