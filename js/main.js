$(document).ready(function () {
  //VARIABLES
  var count=0

  var imgUrlsArray = new Array();
  var usedIndexes = new Array();

  var clientID = "cyxYb2zXiPAFLRNND9tJoznITwUpuexTVlw1Wb_b9mg";
  var numberOfImages = 30;
  var pageNb=0;
  var maxPageNb;

  //First test fetch
  fetch("https://api.unsplash.com/search/photos/?per_page="+numberOfImages+"&client_id="+clientID+"&query=cat,kitten")
    .then(function(data){
      return data.json(); //Get maxPageNumber
    }).then(function(data){
      maxPageNb = data.results.length;
    });

  $("#main-content").click(function(){
    count++;
    $("#title").css("opacity",0);
    //console.log("Used indexes : " + usedIndexes);
    if(count>=numberOfImages){//If you've seen all the images of the page
      pageNb = Math.floor(Math.random() * maxPageNb);//Random page between the all pages of cats
      count = 0; //Reset counter
      usedIndexes = new Array(); //Reset usedIndexes
    }
    var url = "https://api.unsplash.com/search/photos/?page="+pageNb+"&per_page="+numberOfImages+"&client_id="+clientID+"&query=cat,kitten";


    //Make a request to the API
    fetch(url)
      .then(function(data){
        return data.json();
      })
        .then(function(data){
          //console.log(data);
          var randomIndex = Math.floor(Math.random() * data.results.length);
          while(usedIndexes.includes(randomIndex) == true){//If already showed picture on this page
            randomIndex = Math.floor(Math.random() * data.results.length);
          }
          usedIndexes.push(randomIndex);
          //console.log("Random index : "+ randomIndex);

          //console.log(data.results[randomIndex].urls.regular)

          $("#main-content").append('<img class="img" src="'+data.results[randomIndex].urls.regular+'">');

          if($(".img").length >1){//If there is already an image on the page, delete it
            $(".img")[0].remove();
          }
        });

  });

});
