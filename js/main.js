$(document).ready(function () {
  //VARIABLES
  var initialLocalImgs = new Array();
  for(i=1;i<=61;i++){ //61 = total number of images
    initialLocalImgs.push("img/Pictures/"+i+".jpg");
  }
  var actualLocalImgs = [...initialLocalImgs];

  //UNSPLASH VARIABLES
  var clientID = "cyxYb2zXiPAFLRNND9tJoznITwUpuexTVlw1Wb_b9mg";
  var numberOfImages = 30;
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




  //HOME SCREEN
  var selectedAnimalTypes = []
  var range = [];
  //Type select
  $('#cat').click(  ()=>selectType(   ["cat"],     [0.2, 1.1, 1]))//CATS : Cats between 0.2 and 1 and no puppies
  $('#puppy').click(()=>selectType(  ["puppy"],    [0.3, 0, 1]))  //PUPPIES : Puppies between 0 and 1 and no cats
  $('#both').click( ()=>selectType(["cat","puppy"],[0.2, 0.7, 1]))//BOTH : Cats between 0.2 and 0.7 and puppies between 0.7 and 0.1

  function selectType(array,r){
    //Set variable
    selectedAnimalTypes = array
    range = r
    console.log(r)
    //Show right menus
    $('#select').removeClass('visible')
    $('#main-content').addClass('visible')
    console.log(selectedAnimalTypes)


    //TEST FETCH to get maxPageNb and random PageNb for initial fetch, for each animal
    for(i=0; i<selectedAnimalTypes.length; i++){
      animal = selectedAnimalTypes[i]
      initialFetch(animal)
    }
    //initialFetch('cat');
    //initialFetch('puppy');
  }












  $("#main-content").click(function(){
    $("#title").css("opacity",0);

    var randomNum = Math.random();

    if(randomNum>=range[0] && randomNum<range[1]){ //Show random cats from Unsplash
      console.log('show cat')
      updateOnClick('cat');
    }else if(randomNum>=range[1] && randomNum<=1){//Show random puppies from Unsplash
      console.log('show puppy')
      updateOnClick('puppy')
    }else{ //Show our cats
      console.log('show my imgs')
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
