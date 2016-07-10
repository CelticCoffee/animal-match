window.onload = function() {

var Challenge = (function() {

  function PuzzleImage (id, name, src) {
    this.id = id;
    this.name = name;
    this.image = new Image();
    this.src = src;
    this.makeDiv = '<img src="' + src + '">';
  }

  var proto = PuzzleImage.prototype;

  //Private Data//
  var twilight = new PuzzleImage('twilight', 'twilight', 'img/twilight.png')
  var chicken = new PuzzleImage(0, 'chicken', 'img/chicken.jpg');
  var otter= new PuzzleImage(1, 'otter', 'img/otter.jpg');
  var koala = new PuzzleImage(2, 'koala', 'img/koala.jpg');
  var giraffe = new PuzzleImage(3, 'giraffe', 'img/giraffe.jpg');
  var horse = new PuzzleImage(4, 'horse', 'img/horse.jpg');

  //Arrays//
  var animalArray = [];
  animalArray.push(chicken, otter, koala, giraffe, horse);
  //need two versions of the array--one as index and one to shuffle//
  var copyAnimals = animalArray.slice();


  //Using Durstenfeld shuffle algorithm//
  function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
  }

  //Adding to the DOM//


  proto.populateDOM = function() {
    var greenBox = document.getElementById('greenBox');
    var fragment = document.createDocumentFragment();
    var purpleBox = document.getElementById('purpleBox');
       for (var i = 0; i < copyAnimals.length; ++i) {
               var animalButton = document.createElement('button');
               animalButton.className = 'animalButton';
               animalButton.id = copyAnimals[i].id;
               animalButton.src = copyAnimals[i].src;
               oneImage = copyAnimals[i].makeDiv;
               fragment.appendChild(animalButton);
               animalButton.innerHTML = oneImage;
        }

      //When we're done we add this finished SHUFFLED <IMAGES> to the <DIV>//
      greenBox.appendChild(fragment);

      //Here we create the answers using the unshuffled array//

      for (var i = 0; i < animalArray.length; ++i) {
            var li = document.createElement('li');
            li.className = 'hiddenAnswers';
            li.id = animalArray[i].id;
            li.name = animalArray[i].name;
            var oneImage = animalArray[i].makeDiv;
            fragment.appendChild(li);
            li.innerHTML = oneImage;
      }
      purpleBox.appendChild(fragment);
  }

  proto.moveMyMouse = function() {
    var theParent = document.querySelector("#greenBox");
    theParent.addEventListener("mouseover", initiateMouse, true); 
    purpleAnswer = document.querySelector("#purpleBox");

      function initiateMouse(event) {
          //toggles images on hover//
          event.target.addEventListener('mouseout', switchThem, false);
          event.target.addEventListener('dblclick', moveImage, false);

          function switchThem(){
            if (event.target !== event.currentTarget) {
              event.target.src = mousedItem;
            }
          event.stopPropagation();
          }
          var mousedItem = event.target.src;  //has to be twice so they go back and forth//
          event.target.src = twilight.src;
        }


      function moveImage(event) {
        purpleAnswer.addEventListener('click', dropImage, false);
        //has to be inside to have access to mySelection variable//
        mySelection = this.parentNode.id;  //needs to be public
        // console.log(mySelection);  //this will be a number.
        selectionPac = this.parentNode;  //needs to be public
        // console.log(selectionPac);
        this.setAttribute('class', ' movingStyle');
        // console.log(this);
        //to prevent the gray button placeholders from being moveable//

          var self = this;
          document.onmousemove = function(e) {

            e = e || event;
                  self.style.left = e.pageX-1+'px';
                  self.style.top = e.pageY-1+'px';
            }
      }
            var finalScore = 0;
            var wrongAnswer = 0;
            var rightAnswer = 0;
            var currentScore = 0;

      function dropImage(event) {
            var isMatch = event.target.parentNode.id;
            // console.log(isMatch)  //shows ids of the two compared //
            // console.log(mySelection)

            if ((mySelection - isMatch) !== 0) {  //subtracts ids from one another--if they match then obviously they are the same.//
              event.target.src = selectionPac.src;  //replaces correct image with wrong one//
              selectionPac.setAttribute('class', ' hiddenClass') //hides the gray buttons
              event.target.parentNode.setAttribute('class', 'wrongPuzzle');  //will use this to call style //
              wrongAnswer = wrongAnswer + 1; //to keep track of how many pieces have been used//

                  // console.log('you got some wrong answers');
                  // var test =document.querySelectorAll('.wrongPuzzle');
                  // console.log(test)
            }

            if ((mySelection - isMatch) === 0) {
              var matchedChoice = event.target; //this is the correctly matching images/
              console.log(matchedChoice);
              event.target.parentNode.setAttribute('class', 'reveal');
              //hide the original leftSideimage when successfully placed in the purpleBox//
              selectionPac.setAttribute('class', ' hiddenClass');
              rightAnswer = rightAnswer + 1;
            }
            console.log('right answers= ' + rightAnswer);
            console.log('wrong answers= ' + wrongAnswer);
            // console.log(rightAnswer + currentScore + '= total');
            var currentValue = rightAnswer + wrongAnswer;
            console.log(currentValue);
            if(currentValue === 5) {
              var redOnes = document.querySelectorAll('.wrongPuzzle');
              var greenOnes = document.querySelectorAll('.reveal');
              //need to turn these into array I can add CSS classes to//

              function toArray(obj) {
                var myArray = [];
                  for (var m = obj.length >>> 0; m--;) {
                    myArray[m] = obj[m];
                  }
                  return myArray;
              }
              var wrongPuzzles = toArray(redOnes);
              var rightPuzzles = toArray(greenOnes);
              for (var k = 0; k < wrongPuzzles.length; k++) {
                wrongPuzzles[k].setAttribute('class', ' red');
              }
              for (var m = 0; m < rightPuzzles.length; m++){
                rightPuzzles[m].setAttribute('class', ' silly');
              }
              if (rightPuzzles.length === 5) {
                purpleAnswer.setAttribute('class', ' allCorrect');
              }
              var percentageScore = ( rightAnswer / currentValue) * 100;
              alert('You received a score of ' + percentageScore + '%');
            }
          }
        }

  //end of mouse functions
  //Make the magic--ie call the functions//
  shuffleArray(copyAnimals);  //This makes the puzzle change each time//
  proto.populateDOM(); // This puts all of the images and such into the DOM//
  proto.moveMyMouse(); //This is for the mouse events.//

  var shuffler = document.getElementById('shuffleButton');
  shuffler.addEventListener('click', function(event){
  console.log('clicked')
  location.reload();

  });

  return PuzzleImage;

  })();

  }
