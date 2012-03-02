

var firstPack = null;


$(window).ready(function(){


  // Find out what packages are available
  $.getJSON('packs_cards/_files.json', function(files, textStatus){

    for (fileIndex in files) {

      // Assign the first pack
      if(!firstPack) {
        firstPack = fileIndex;
        $('iframe').attr('src', 'index_game.html?pack='+firstPack);
      }
      
      // Cycling through packages, to create menu of "packs" to choose from
      if(typeof files[fileIndex] === 'object') {
        
        var filepath = 'packs_cards/' + fileIndex + '/_data.json';
        $.ajax({
          url: filepath,
          dataType: 'json',
          async: false,
          success: function(cardData){
            var cards = cardData.cards;
            for (cardIndex in cards) {
              
              var card = cards[cardIndex];
              card.packID = fileIndex;
              var listItem = themePackListItem(card);
              listItem.appendTo('.pack-list-container');
              
              break;
              // We are using first card as "title" for now.
              // So, only loop though the first time, then, break.
            }
            
          }
        })
        .error(function(){
          alert('Could not get _data.json file');
        });
        
      }
      
    }
    
  })
  .error(function(){
    alert('There was an error getting the file.');
  });

  
  
  
});


function themePackListItem(pack) {
  var listItem = $("<div class='game-list-item'><div class='game-list-item-title'>TITLE</div></div>")
  var imgURL = './packs_cards/'+pack.packID+'/'+pack.NID+'-CARD.jpg';
  var deckImage = '<div><img src="'+imgURL+'" /></div>';
  var link = $('<a />').attr('href', "index_game.html?pack="+pack.packID).attr('target', 'cardgame').html(deckImage);
  listItem.children('.game-list-item-title').html(link);
  return listItem;
}
