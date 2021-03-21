$(document).ready(function () {
  var initialLocalImgs = new Array();
  for(i=1;i<=50;i++){ //50 = total number of images
    initialLocalImgs.push("img/Pictures/"+i+".jpg");
  }
  var actualLocalImgs = [...initialLocalImgs];

  var count=0;

  //UNSPLASH VARIABLES
  var fetchedImgUrls = new Array();
  var usedIndexes = new Array();

  var clientID = "cyxYb2zXiPAFLRNND9tJoznITwUpuexTVlw1Wb_b9mg";
  var numberOfImages = 30;
  var pageNb;
  var maxPageNb;
  var query = "cute_kitten,kitten,kitty,cute_cat,cat";

  //TEST FETCH to get maxPageNb and random PageNb for initial fetch
  fetch("https://api.unsplash.com/search/photos/?per_page="+numberOfImages+"&client_id="+clientID+"&query="+query)
    .then(function(data){
      return data.json(); //Get maxPageNumber
    }).then(function(data){
      maxPageNb = data.total_pages;
      pageNb = Math.floor(Math.random() * maxPageNb);
  });

  //INITIAL FETCH
  fetchData("https://api.unsplash.com/search/photos/?page="+pageNb+"&per_page="+numberOfImages+"&client_id="+clientID+"&query="+query);

  $("#main-content").click(function(){
    $("#title").css("opacity",0);

    var randomNum = Math.random();

    if(randomNum>0.2){ //Show random animals from Unsplash 80% of the time
      count++;
      //console.log("Count : " + count);

      //SHOW IMAGE
      if(fetchedImgUrls !=null){
        var randomIndex = Math.floor(Math.random() * fetchedImgUrls.length);
        while(usedIndexes.includes(randomIndex) == true){//If already showed picture on this page
          randomIndex = Math.floor(Math.random() * fetchedImgUrls.length);
        }
        usedIndexes.push(randomIndex);
        //console.log("Used indexes : " + usedIndexes);

        $("#main-content").append('<img class="img" src="'+fetchedImgUrls[randomIndex]+'">');

        if($(".img").length >1){//If there is already an image on the page, delete it
          $(".img")[0].remove();
        }
      }else{console.log("Cannot connect to the API.")}


      //If on next click you will have to request
      if(count == numberOfImages){

        pageNb = Math.floor(Math.random() * maxPageNb);//Random page between the all pages of cats
        count = 0; //Reset counter
        usedIndexes = new Array(); //Reset usedIndexes

        var url = "https://api.unsplash.com/search/photos/?page="+pageNb+"&per_page="+numberOfImages+"&client_id="+clientID+"&query="+query;

        //Make a request to the API
        fetchData(url);
      }
    }else{ //Show our cats
      if(actualLocalImgs.length ==0){
        actualLocalImgs = [...initialLocalImgs]; //Reset to initial values when all images seen
      }

      var randomIndex = Math.floor(Math.random() * actualLocalImgs.length);

      $("#main-content").append('<img class="img" src="'+actualLocalImgs[randomIndex]+'">'); //Instantiate the image
      actualLocalImgs.splice(randomIndex,1); //Remove the image from the list

      if($(".img").length >1){//If there is already an image on the page, remove it
        $(".img")[0].remove();
      }
    }




  });

  function fetchData(url){
    fetch(url)
      .then(function(data){
        return data.json();
      }).then(function(data){
          //console.log(data);
          fetchedImgUrls = new Array();
          for(i=0;i<data.results.length;i++){
            fetchedImgUrls.push(data.results[i].urls.regular)
          }
          //console.log(fetchedImgUrls);
          //console.log("Response");
    });
  }

});
