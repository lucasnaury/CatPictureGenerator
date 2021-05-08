$(document).ready(function () {
  var initialLocalImgs = new Array();
  for(i=1;i<=52;i++){ //52 = total number of images
    initialLocalImgs.push("img/Pictures/"+i+".jpg");
  }
  var actualLocalImgs = [...initialLocalImgs];


  //UNSPLASH VARIABLES
  var animals = {
    cat : {
      fetchedImgUrls : new Array(),
      usedIndexes : new Array(),
      pageNb : 0,
      maxPageNb : 0,
      query:"cute_kitten,kitten,kitty,cute_cat,cat",
      count : 0
    },
    puppy : {
      fetchedImgUrls : new Array(),
      usedIndexes : new Array(),
      pageNb : 0,
      maxPageNb : 0,
      query:"cute_puppy,puppy,pup,puppy_dog,baby_dog,young_dog,cute_baby_dog",
      count : 0
    }
  };


  var clientID = "cyxYb2zXiPAFLRNND9tJoznITwUpuexTVlw1Wb_b9mg";
  var numberOfImages = 30;
  //TEST FETCH to get maxPageNb and random PageNb for initial fetch, for each animal
  initialFetch('cat');
  initialFetch('puppy');




  $("#main-content").click(function(){
    $("#title").css("opacity",0);

    var randomNum = Math.random();

    if(randomNum>0.2 && randomNum<0.7){ //Show random cats from Unsplash 50% of the time
      updateOnClick('cat');
    }else if(randomNum>0.7 && randomNum<=1){
      updateOnClick('puppy');

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

  function fetchData(url,animalName){
    fetch(url)
      .then(function(data){
        return data.json();
      }).then(function(data){
          //console.log(data);
          animals[animalName].fetchedImgUrls = data.results.map((result)=>{
            return result.urls.regular;
          });

          return animals[animalName].fetchedImgUrls;
          //console.log(animals[animalName].fetchedImgUrls);
          //console.log("Response");
    });
  }

  function initialFetch(animalName){
    fetch("https://api.unsplash.com/search/photos/?per_page="+numberOfImages+"&client_id="+clientID+"&query="+animals[animalName].query) //Get th
      .then(function(data){
        return data.json(); //Get maxPageNumber
      }).then(function(data){
        if(animalName == "puppy"){
          animals[animalName].maxPageNb = data.total_pages / 8; //Only take the first 1/8 pages to make sure they match the keywords well
        }else{
          animals[animalName].maxPageNb = data.total_pages / 2; //Only take the first half pages to make sure they match the keywords well
        }
        animals[animalName].pageNb = Math.floor(Math.random() * animals[animalName].maxPageNb);
    }).then(function(){
      //INITIAL FETCH
      fetchData("https://api.unsplash.com/search/photos/?page="+animals[animalName].pageNb+"&per_page="+numberOfImages+"&client_id="+clientID+"&query="+animals[animalName].query,animalName);
    });
  }

  function updateOnClick(animalName){
    animals[animalName].count++;
    //console.log(animalName +" count : " +   animals[animalName].count);
    //SHOW IMAGE
    if(animals[animalName].fetchedImgUrls !=null){
      var randomIndex = Math.floor(Math.random() * animals[animalName].fetchedImgUrls.length);
      while(animals[animalName].usedIndexes.includes(randomIndex) == true){//If already showed picture on this page
        randomIndex = Math.floor(Math.random() * animals[animalName].fetchedImgUrls.length);
      }
      animals[animalName].usedIndexes.push(randomIndex);
      //console.log("Used indexes : " + animals[animalName].usedIndexes);

      $("#main-content").append('<img class="img" src="'+animals[animalName].fetchedImgUrls[randomIndex]+'">');

      if($(".img").length >1){//If there is already an image on the page, delete it
        $(".img")[0].remove();
      }
    }else{console.log("Cannot connect to the API.")}


    //If on next click you will have to request
    if(animals[animalName].count == numberOfImages){

      animals[animalName].pageNb = Math.floor(Math.random() * animals[animalName].maxPageNb);//Random page between the all pages of cats
      if(animalName =="puppy") console.log("Page : " + animals[animalName].pageNb);
      animals[animalName].count = 0; //Reset counter
      animals[animalName].usedIndexes = new Array(); //Reset usedIndexes

      var url = "https://api.unsplash.com/search/photos/?page="+animals[animalName].pageNb+"&per_page="+numberOfImages+"&client_id="+clientID+"&query="+animals[animalName].query;

      //Make a request to the API
      fetchData(url,animalName);
    }
  }

});
