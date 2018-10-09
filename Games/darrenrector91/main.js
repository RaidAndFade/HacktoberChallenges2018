(function() {

	var sliderPuzzle = {
    
		setup : function() {
			$("td").click(sliderPuzzle.tileClick);
		},

		isEmptySquare : function( $image) {
			var altText = $image.attr("alt");
			if (altText === "empty") {
				return true;
			} else {
				return false;
			}
		},

		tileClick : function() {

			var $td, $clickImg, $emptyImg, temp;

			$td = $(this)
			$clickImg = $td.children().first();

			//See if we click on the empty spot to give message.
			if (sliderPuzzle.isEmptySquare($clickImg)) {
				alert("Click on an image to the square to move it.");
			} else {
				//Look for empty square
				$emptyImg = sliderPuzzle.checkForEmpty($td);
				console.log($emptyImg);

				if ($emptyImg === null) {
					alert("Click on an image next to the empty square to move it.");
				} else {

					//Swap images
					temp = $clickImg.attr("src");
					$clickImg.attr("src", $emptyImg.attr("src"));
					$emptyImg.attr("src", temp);

					temp = $clickImg.attr("alt");
					$clickImg.attr("alt", $emptyImg.attr("alt"));
					$emptyImg.attr("alt", temp);

					// Check for win
					if (sliderPuzzle.checkForWin()) {
						$("#puzzleGrid").addClass("win");
					}
				}
			}
    },

		checkForEmpty : function($td) {

			var newRow, newCol, idToCheck, $img;

			var id = $td.attr("id");
			var row = id.substring(4, 5);
			var col = id.substring(5, 6);


			// Check top
			if (row > 1) {
				newRow = parseInt(row) - 1;
				newCol = col;

				$img = sliderPuzzle.getImageFromCell(newRow, newCol);
				if (sliderPuzzle.isEmptySquare($img)) {
					//Found empty spot  
					return $img;
				}
			}

			// Check bottom
			if (row < 4) {

				newRow = parseInt(row) + 1;
				newCol = col;
				$img = sliderPuzzle.getImageFromCell(newRow, newCol);


				if (sliderPuzzle.isEmptySquare($img)) {
					//Found empty spot  
					return $img;
				}
			}

			// Check left
			if (col > 1) {
				newRow = row;
				newCol = parseInt(col) - 1;
				$img = sliderPuzzle.getImageFromCell(newRow, newCol);
				if (sliderPuzzle.isEmptySquare($img)) {
					//Found empty spot  
					return $img;
				}
			}

			// Check right
			if (col < 4) {
				newRow = row;
				newCol = parseInt(col) + 1;
				$img = sliderPuzzle.getImageFromCell(newRow, newCol);
				if (sliderPuzzle.isEmptySquare($img)) {
					//Found empty spot  
					return $img;
				}

			}
			return null;
		},

		getImageFromCell : function (row, col) {
			idToCheck = "#cell" + row + col;
			console.log("id below" + idToCheck);
			return $(idToCheck).children().first();

		},

		checkForWin : function () {

			var i, counter, $allImages, isWin;

			isWin = true;
			counter = 1;
			allImages = $("img").each(function (index, element) {
				var altText = $(this).attr("alt");

				if (counter === 16) {
					//should be empty
					if (altText != "empty")
						isWin = false;
					return false;
				}
				else {

					if (altText != counter) {
						isWin = false;
						return false;
					}
				}

				counter = counter + 1;
			});

			return isWin;

		}

	}

	sliderPuzzle.setup();
	
	$( "<p>" ).text( "Click the tile next to the open square to start the game!").insertBefore("#puzzle");

}());