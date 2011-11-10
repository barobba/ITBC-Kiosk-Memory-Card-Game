/* Author: 

*/

$(document).ready(function () {
	var deck = "deck1";

	$.getJSON("packs/" + deck + "/_data.js", 
		function(json) {
			$.each(json.cards, function(key, val) {

				// TODO: shuffle deck and duplicate them
				
				var img_src = json.pack_location + '/' + val.pic;
				var aud_src = json.pack_location + '/' + val.aud;

				$('<dt class="card back" id="'+val.word+'"><img src="img/back_of_card.png" alt="" /></dt>').appendTo("#game");
				$('<dd class="card front" id="'+val.word+'_flip"><img src="' + img_src +'" alt="" /><audio id="' + val.word + '_audio" preload="auto"><source src="' + aud_src + '" type="audio/mp3" /></audio></dt>').appendTo("#game");
			});
		});

	$('.back').live("click", function() { flipCard($(this)); });
});

function flipCard(el) {
	var new_id = el.attr("id") + "_flip";
	var aud_id = el.attr("id") + "_audio";

		el.flip({
			direction: "lr",
			color: "white",
			content: $('#' + new_id),
			onEnd: function() {
				document.getElementById(aud_id).play();
			}
		});

	// TODO: Figure out reverting cards
	/* el.die();
	el.live("click", function() { revertCard(el); }); */
}

/* function revertCard(el) {
	el.revertFlip();

console.log("revert");
	
	el.die();
	el.live("click", function() { flipCard(el); });	
} */