/*
Draw two circles, one for showing the skill percentage,
other as a background based on the canvas and json's
skill value
*/
function drawCircle(skillValue, i) {
  let canvas = document.getElementsByTagName('canvas');
  // Calculate arc's arguments
  let x = canvas[i].width / 2;
  let y = canvas[i].height / 2;
  let radius = 65;
  // Calculate positions
  let per = parseFloat(100 / skillValue);
  let start = (Math.PI * 2) / per;
  let end = 0;
  // Set the drawing animation
  let context = canvas[i].getContext('2d');
  let drawPerc = setInterval(() => {
    // Animation finish state
    if(end > start) {
      clearInterval(drawPerc);
    } else {
      // Start Animation
      end = end + 0.1;
      // Clear canvas
      context.clearRect(0, 0, canvas[i].width+1, canvas[i].height+1);
      // Draw inner grey Circle
      context.beginPath();
      context.arc(x, y, radius, 0, 2*Math.PI);
      context.lineWidth = 10;
      context.strokeStyle = '#d6d6d6'
      context.font = "24px sans-serif";
      context.fillStyle = '#57544e';
      // Centering the text
      if(parseInt(skillValue) === 100) {
        context.fillText(skillValue + "%", x - 25, y + 10);
        console.log("here");
      } else {
        context.fillText(skillValue + "%", x - 15, y + 10);
      }
      context.stroke();
      // Draw Blue Percentage
      context.beginPath();
      context.arc(x, y, radius, 0, end);
      context.lineWidth = 10;
      context.strokeStyle = '#0b74b6';
      context.stroke();
    }
  }, 70);
}

/*
Set an AJAX request and get the data from the
skill-set json
*/
function createSkillSet() {
  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if(xhr.readyState === XMLHttpRequest.DONE) {
      let data = JSON.parse(xhr.responseText);
      let length = data.skills.length;
      /*
      Create a div with skill class,
      then a canvas tag to draw the circles in,
      then a heading tag and a paragprah tag
      for each skill object
      */
      for(let i = 0; i < length; i++) {
        // Create div container
        let div = document.createElement("DIV");
        let space = document.getElementsByTagName('article');
        space[0].appendChild(div);
        div.className = "skill";
        // Create canvas
        let canvas = document.createElement("CANVAS");
        let skill = document.getElementsByClassName('skill');
        skill[i].appendChild(canvas);
        drawCircle(data.skills[i].value, i); // Call to draw circles
        // Create heading and use the json data's skill name as heading
        let heading = document.createElement('H4');
        div.appendChild(heading);
        let text = document.createTextNode(data.skills[i].skill);
        heading.appendChild(text);
        // Create paragraph and use json data's description as its text
        let para = document.createElement('P');
        div.appendChild(para);
        let p = document.createTextNode(data.skills[i].description);
        para.appendChild(p);
      }
    }
  };
  xhr.open("GET", "skill-set.json", true);
  xhr.send();
}

/*
Display main content and scroll to it
then calls the function to create the
skill pie chart dynamically
*/
let more = document.getElementById("see-more");
more.addEventListener("click", function(){
  // Hide this see more link
  more.classList.add('hidden');
  // Display the main content
  let main = document.getElementById("main");
  main.classList.remove("hidden");
  main.classList.add("content");
  // Get the top section's css height
  let top = document.getElementsByClassName('top')[0];
  let topStyle = window.getComputedStyle(top);
  let height = parseInt(topStyle.getPropertyValue('height'));
  /* Use that height to scroll the user to
  the main content*/
  let time =  30;
  let start = 0;
  let increment = height / time;
  // Scrolling Animation until main content is reached
  let frame = setInterval(() => {
    if ((start + 5) >= height) {
      clearInterval(frame);
    } else {
      start = start + increment;
      window.scroll(0, start);
    }
  }, time);
  // Call to dynamically create skills pie chart
  createSkillSet();
});
