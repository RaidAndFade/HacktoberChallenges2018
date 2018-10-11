$(document).ready(function() {
  let currentToken;
  let currentTokenDigit;
  let rand;
  let strikeCount = 0;
  let currentCar;
  let tokenArr = [];
  let priceArr = [];
  let priceCount = 0;
  let timer = 0;
  const cars = {
    car0: {
      name: "Audi A4",
      price: 49125,
      src: "url(http://www.jarrodyellets.com/images/cars/AudiA4.jpg)"
    },
    car1: {
      name: "Batmobile",
      price: 92765,
      src: "url(http://www.jarrodyellets.com/images/cars/Batmobile.png)"
    },
    car2: {
      name: "Smart fortwo",
      price: 21389,
      src: "url(http://www.jarrodyellets.com/images/cars/Smart42.jpg)"
    },
    car3: {
      name: "Citroen Berlingo",
      price: 14236,
      src: "url(http://www.jarrodyellets.com/images/cars/Citroen.jpg)"
    },
    car4: {
      name: "Porsche Cayenne",
      price: 69785,
      src: "url(http://www.jarrodyellets.com/images/cars/Porsche.jpg)"
    },
    car5: {
      name: "Love Beetle",
      price: 21360,
      src: "url(http://www.jarrodyellets.com/images/cars/Beetle.jpg)"
    },
    car6: {
      name: "Mirth Mobile",
      price: 10635,
      src: "url(http://www.jarrodyellets.com/images/cars/Mirth.png)"
    },
    car7: {
      name: "Delorean DMC-12",
      price: 89435,
      src: "url(http://www.jarrodyellets.com/images/cars/Delorean.jpg)"
    },
    car8: {
      name: "Tie Fighter",
      price: 97482,
      src: "url(http://www.jarrodyellets.com/images/cars/TieFighter.jpg)"
    },
    car9: {
      name: "Ghost Busters Ecto-1",
      price: 15672,
      src: "url(http://www.jarrodyellets.com/images/cars/Ecto1.jpg)"
    },
    car10: {
      name: "Millennium Falcon",
      price: 98612,
      src: "url(http://www.jarrodyellets.com/images/cars/Falcon.jpg)"
    },
    car11: {
      name: "Griswold Family Truckster",
      price: 12875,
      src: "url(http://www.jarrodyellets.com/images/cars/Truckster.jpg)"
    },
    car12: {
      name: "Flintstones Footmobile",
      price: 10298,
      src: "url(http://www.jarrodyellets.com/images/cars/Flintstones.png)"
    }
  };

  let carArr = Object.keys(cars);

  let quotes = {
    welcome:
      "Welcome to 3 Strikes!  Click either <button class='quoteButton' id='rules'>Rules</button> or <button class='quoteButton' id='play'>Play</button>.",
    showPrize: "Lets Go! Here is what you will be playing for!",
    rules:
      "The contestant is shown eight discs, five of which have a unique digit representing one of the five numbers in the price of the car, and three red discs that each have an X, called a strike. The discs are placed into a bag and shuffled. The contestant blindly draws a disc from the bag. If they pick a number, they must decide in which position (spot) that digit belongs e.g.: 'the third digit'. If they are correct, the disc is discarded into a slot in the game board and the digit is lit up in the price display. If they are incorrect, it was not a strike. The disc gets returned to the bag and the contestant draws again. If the contestant draws a strike, a strike marker is lit on the board and the disc is discarded into the slot. The contestant may continue to draw as many times as possible until he or she either correctly positions each digit in the price and wins the car or draws the three strikes and loses the game.<button class='quoteButton' id='playNow'>Play</button>",
    selectToken: "Please pick a token from the bag.",
    correct: "Correct!",
    wrong: "Wrong! Please select another token.",
    lose: "3 strikes!  Sorry, but you lost the game.",
    playAgain: "<button class='quoteButton' id='playAgain'>Play Again</button>"
  };

  setup();

  //   Initial setup of game
  function setup() {
    currentCar = carArr[Math.round(Math.random() * (carArr.length - 1))];
    $(".car").css("background-image", cars[currentCar].src);
    $(".numScreen").addClass("blank");
    $(".numScreen").empty();
    $(".strike").empty();
    $(".token").removeClass("hide");
    $(".token").removeClass("raiseToken");
    $(".token").removeClass("rotate");
    priceArr = ("" + cars[currentCar].price).split("").map(Number);
    strikeCount = 0;
    priceCount = 0;
    timer = 0;
    tokenArr = priceArr.slice().sort((a, b) => a - b);
    openingRemarks();
  }

  //   Choose to view rules or play
  function openingRemarks() {
    changeQuote(quotes.welcome);
    $("#rules").click(function() {
      changeQuote(quotes.rules);
      $("#playNow").on("click", function() {
        startGame();
      });
    });
    $("#play").click(function() {
      startGame();
    });
  }

  //   Change quotes in text box
  function changeQuote(quote) {
    $(".text").empty();
    $(".text").append(quote);
  }

  //   Start game by showing prize
  function startGame() {
    changeQuote(quotes.showPrize);
    setTimeout(function() {
      $(".curtain").addClass("raiseCurtain");
      changeQuote("Its a " + cars[currentCar].name + " !");
    }, 3000);
    setTimeout(function() {
      makeTokens();
    }, 6000);
  }

  //   Write numbers of price of car on tokens
  function makeTokens() {
    $(".numToken").empty();
    for (let i = 0; i < tokenArr.length; i++) {
      $("#token" + i).append(tokenArr[i]);
    }
    tokenArr = [
      "token0",
      "token1",
      "token2",
      "token3",
      "token4",
      "token5",
      "token6",
      "token7"
    ];
    changeQuote(
      "Here are your tokens.  Five numbers make up the price of the " +
        cars[currentCar].name +
        " and 3 strikes."
    );
    setTimeout(function() {
      grabTokens();
    }, 3000);
  }

  //   Grab tokens to raise out of bag
  function grabTokens() {
    for (let i = 0; i < 8; i++) {
      raiseToken(i, timer);
      timer += 1500;
    }
    setTimeout(function() {
      playGame();
    }, 13000);
  }

  //   Raise and lower tokens from bag
  function raiseToken(index, timer) {
    setTimeout(function() {
      $("#token" + index).addClass("raiseToken");
    }, timer);
    setTimeout(function() {
      $("#token" + index).removeClass("raiseToken");
    }, timer + 1500);
  }

  //   Choose a token from the bag
  function playGame() {
    changeQuote(quotes.selectToken);
    $(".bag").on("click", function() {
      $(".bag").off();
      rand = Math.round(Math.random() * (tokenArr.length - 1));
      currentToken = tokenArr[rand];
      currentTokenDigit = $("#" + currentToken).html();
      $("#" + currentToken).addClass("raiseToken");
      selectToken();
    });
  }

  //   Check if token is a number or a strike
  function selectToken() {
    if (currentTokenDigit === "X") {
      strikeCount++;
      changeQuote("Oh No!  Strike " + strikeCount + "!");
      setTimeout(function() {
        $("#strike" + strikeCount).append("X");
      }, 2200);
      depositToken();
    } else {
      changeQuote(
        "You picked " +
          currentTokenDigit +
          ". Select where you think the " +
          currentTokenDigit +
          " goes."
      );
      selectScreen();
    }
  }

  //   Choose which screen the number belongs
  function selectScreen() {
    $(".blank").on("click", function() {
      $(".blank").off();
      let screenId = Number($(this).attr("id"));
      if (priceArr[screenId] == currentTokenDigit) {
        $("#" + screenId).append(currentTokenDigit);
        $("#" + screenId).removeClass("blank");
        changeQuote(quotes.correct);
        priceCount++;
        depositToken();
      } else {
        changeQuote(quotes.wrong);
        setTimeout(function() {
          $("#" + currentToken).removeClass("raiseToken");
          playGame();
        }, 1000);
      }
    });
  }

  //   Put token in slot
  function depositToken() {
    setTimeout(function() {
      tokenArr.splice(rand, 1);
      $("#" + currentToken).addClass("rotate");
    }, 1500);
    setTimeout(function() {
      $("#" + currentToken).addClass("hide");
      if (strikeCount === 3) {
        strikeOut();
      } else if (priceCount === 5) {
        winGame();
      } else {
        setTimeout(function() {
          playGame();
        }, 1000);
      }
    }, 2200);
  }

  //   Lose game
  function strikeOut() {
    changeQuote(quotes.lose);
    setTimeout(function() {
      lowerCurtain();
    }, 3000);
  }

  //   Win game
  function winGame() {
    changeQuote("Congratulations!  You won the " + cars[currentCar].name + "!");
    $(".blink").addClass("blinking");
    setTimeout(function() {
      lowerCurtain();
    }, 5000);
  }

  //   Lower prize curtain
  function lowerCurtain() {
    changeQuote(quotes.playAgain);
    $("#playAgain").on("click", function() {
      $(".blink").removeClass("blinking");
      $(".curtain").removeClass("raiseCurtain");

      setTimeout(function() {
        setup();
      }, 1000);
    });
  }
});