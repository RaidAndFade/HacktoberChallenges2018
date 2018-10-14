
var storyName = ["A Day At The Beach"];
var storyElements = [["Name", "Kind of machine", "Present tense verb", "Object", "Small object", "Alien name", "Type of food", "Number", "Type of space ship"]];
var storyNumber = 0;
var storyBody = ['$elem0 looks at the machine he/she built. "They said it was impossible!" he/she says out loud. "They said I was crazy! But who is crazy now that I have finished my $elem1!". The expression on his/her face changes. "I wonder what would happen if I $elem2 the $elem3".\n\nSomewhere in the galaxy a red light begins flashing and strange characters begins printing out on a monitor. An alien creature drops its $elem4 and grabs a communication device with its manipulator appendage.\n\n"Yes I know he is in a meeting with the $elem5. One of our remote probes detected something he needs to see immediately."\n\nThe commander bursts into the room. "This better be important. I was negotiating $elem6 prices for this sector". "Take a look at this data, sir". "Get me in contact with outpost $elem7 and have them send a $elem8 out immediately".\n\nThen, uh, Will Smith flies an alien space ship and uploades a computer virus stopping the invasion and saving the Earth.'];

function createForm(){
  <!-- set story number -->
  document.open();
  document.write("<h1 id = sName>" + storyName[storyNumber] + "<h1><form><table>");
  for(var i = 0; i < storyElements[storyNumber].length; i++){
      document.write("<tr><td>" + storyElements[storyNumber][i] + '</td><td><input type="text" size="20" id="elem' + i.toString() + '"></td></tr>');
  }
  <!-- text area, button, table closing tag, and form closing tag-->
  document.write('</table><input type="button" value="Create a story" onclick="generateStory()"><br><textarea rows="10" cols="40" id="storyOutput">Your Story</textarea></form>');
  document.close()
}

function generateStory(){
  var story = storyBody[storyNumber];
  for(var i = 0; i < storyElements[storyNumber].length; i++){
    var elemID = "elem" + i.toString();
    story = story.replace("$" + elemID, document.getElementById(elemID).value);
  }
  document.getElementById("storyOutput").value = story;
}