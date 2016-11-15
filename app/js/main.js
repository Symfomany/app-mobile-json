
$(document).ready(function() {

  // Initialize collapse button
  $(".button-col").sideNav();

  var $grid = $('.grid').masonry({
    itemSelector: '.grid-item',
  });

  //____________________________________No ui slider____________________________________

  var slider = document.getElementById('test5');
  noUiSlider.create(slider, {
    start: [ 20 ],
    step: 1,
    range: {
      'min': 10,
      'max': 100
    },
    format: wNumb({
      decimals: 0
    })
  });

  var maxItems = 20;
  $( "#test5" ).mouseup(function() {
    maxItems = slider.noUiSlider.get();
  });

  // End No ui slider

  //____________________________________AJAX____________________________________

	$('nav').on("click", "a.yo", (function() {

		$('a.yo').removeClass("active");//effet css
		$(this).addClass("active");

		var flickrAPI = "http://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?";
		var photoSelection = $(this).text();
    console.log($(this));
     // text du lien html
		var flickrOptions = {
			tags: photoSelection,
			format: "json"
		};

		function displayPhotos(data){
      var photoHTML = '';
			$.each( data.items, function(i, photo){
				photoHTML += '<div class="grid-item"><div class="card"><div class="card-image">';
				photoHTML += '<img src="' + photo.media.m + '" class="image">';

        var tabTag = photo.tags.split(" ");
        tagTagLength = (tabTag.length > 10) ? 10 : tabTag.length;

        for (var j = 0; j < tagTagLength; j++) {
          photoHTML += '<div class="chip">' + tabTag[j] + '</div>';
        }

        photoHTML += '<div class="card-action"><a href="'+ photo.media.m +'">'+ photo.title +'</a></div>';
        photoHTML += '</div></div></div>';
        return i < maxItems-1;
			});

			$('#photos').html(photoHTML); // insertion dans le html

      $grid.masonry('reloadItems');

      $grid.imagesLoaded().progress(function() {
          $grid.masonry('layout');
      });

		} // END displayPhotos(data)

		$.getJSON(flickrAPI, flickrOptions, displayPhotos);

    $.ajax({
         beforeSend: function() {
            $("#loading-image").show();
         },
         success: function() {
            $("#loading-image").hide();
         }
    });
	}));
  //END AJAX

  //____________________________________NEW TAGS____________________________________

  var datTAGS = function(){ // fonction de traitement des tags
      if(monobjet_json){ //si mon objet json existe alors...
         monobjet_json = sessionStorage.getItem("clefSession"); //on va le cherger
         theTags = JSON.parse(monobjet_json);
         console.log(theTags);
      } else {
        monobjet_json = JSON.stringify(theTags); // si il ne l'est pas on le cré
        sessionStorage.setItem("clefSession", monobjet_json);
        theTags = JSON.parse(monobjet_json);
        console.log(theTags);
      }
      var tagHTML = "", // chaine qui va contenir les tags "liste"
          newTagHTML = ""; // chaine qui va contenir les tags "menu"
      if ($('input#tag').val().length >= 2){ // Vérif : val sup à 2 caracteres + convertion des balises html
        theTags.push($('input#tag')
        .val()
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;"));
        $('input#tag').val('');
        $('input#tag').addClass('valid');
      } else {
        $('input#tag').addClass('invalid');
      }
      for (var k = 0; k <  theTags.length; k++) { // insertion dans le html
        tagHTML += '<div class="chip">' + theTags[k] + '<i class="close material-icons">close</i></div>';
        newTagHTML  += '<li class="tab"><a class="yo waves-effect waves-light"  href="#">' + theTags[k] + '</a></li>';
      }
      $('#sup').html('<ul id="newMenuTags" class="tabs tabs-transparent"></ul>'); // création du sous menu
      $('nav').addClass('nav-extended');
      $('#newMenuTags').html(newTagHTML); // Tag sous-menu
      $('#newTags').html(tagHTML); // Tag sidebar

      monobjet_json = JSON.stringify(theTags); // et on re-set la session storage
      sessionStorage.setItem("clefSession", monobjet_json);



  };

  var theTags = []; // variable contenant les tags
  var monobjet_json = sessionStorage.getItem("clefSession"); // pour voir si l'objet existe quand on initialise la fonction datTAGS

  datTAGS();

  $('form').click(function() {
    datTAGS();
	});
  $("input").keypress(function(event) {
    if (event.which == 13) {
        datTAGS();
    }
  });

  $('#newTags').on("click", "i.close", (function() {

    var texTag = $(this).parent().text();
    texTag = texTag.substring(0,texTag.length-5);

    for (var l = 0; l <  theTags.length; l++) {
      if (texTag === theTags[l]) {
        theTags.splice(l,1);
        var tagHTML = "",
            newTagHTML = "";
        for (var k = 0; k <  theTags.length; k++) {
          tagHTML += '<div class="chip">' + theTags[k] + '<i class="close material-icons">close</i></div>';
          newTagHTML  += '<li class="tab"><a class="yo waves-effect waves-light"  href="#">' + theTags[k] + '</a></li>';
        }
        $('#sup').html('<ul id="newMenuTags" class="tabs tabs-transparent"></ul>'); // création du sous menu
        $('nav').addClass('nav-extended');
        $('#newMenuTags').html(newTagHTML); // Tag sous-menu
        $('#newTags').html(tagHTML); // Tag sidebar

        monobjet_json = JSON.stringify(theTags);
        sessionStorage.setItem("clefSession", monobjet_json);
      }
    }

  }));

  //END NEW TAGS


});
