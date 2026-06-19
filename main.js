import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";

import {
  getDatabase,
  ref,
  push,
  get
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-database.js";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBWCqu9cS6K-5U3xaDT_jsGRX3p3wWTs9U",
  authDomain: "connessioni-6515d.firebaseapp.com",
  databaseURL: "https://connessioni-6515d-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "connessioni-6515d",
  storageBucket: "connessioni-6515d.firebasestorage.app",
  messagingSenderId: "940358109080",
  appId: "1:940358109080:web:01a1e1932b95a1e4ea4ded"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
var yyyy = today.getFullYear();

today = '20' + '_' + mm + '_' + yyyy;


const snapshot = await get(ref(db, today));
const data = snapshot.val();

const cat = Object.keys(data);
const categories = cat.flatMap(str => str.replaceAll(" ", "+"));
const sus = Object.values(data);
const words = sus.flatMap(str => str.split(", "));

console.log(cat[2]);
console.log(words);


const grid = document.getElementById("grid");
var selections=0;
var max=0;
var solutions=0;
var lifes =4;
function Solve(matchedButtons,cleanClass,categories, document, solutions, colorArray, cat){
    var text=[];
    const index = categories.indexOf(cleanClass);
    console.log("qui");
    console.log(cat);
    let sos= categories.flatMap(str => str.replaceAll("+", " "));
     // Mark them as solved
    matchedButtons.forEach(btn => {
        btn.classList.remove("active");

        text=text + btn.textContent+', ';
        if (solutions===0){
          btn.classList.add("first")
          document.getElementById("one").style.opacity = "1.0";
          document.getElementById("one").style.backgroundColor = colorArray[index];
          document.getElementById("one").innerHTML = sos[index]+ "<br>"+ text;
          console.log("punto");
        }
        if (solutions===1){
          btn.classList.add("second") 
          document.getElementById("two").style.opacity = "1.0";
          document.getElementById("two").style.backgroundColor = colorArray[index];
          document.getElementById("two").innerHTML = sos[index]+ "<br>"+ text;
        }
        if (solutions===2){
          btn.classList.add("third") 
          document.getElementById("three").style.opacity = "1.0";
          document.getElementById("three").style.backgroundColor = colorArray[index];
          document.getElementById("three").innerHTML = sos[index]+ "<br>"+ text;
          
        }
        if (solutions===3){
          btn.classList.add("fourth")
          document.getElementById("four").style.opacity = "1.0";
          document.getElementById("four").style.backgroundColor = colorArray[index];
          document.getElementById("four").innerHTML = sos[index]+ "<br>"+ text;
        }

        btn.classList.add("Solved");
    });

    // Buttons that are solved
    const firstSolved = [...grid.children].filter(btn =>
        btn.classList.contains("first")
    );
    const secondSolved = [...grid.children].filter(btn =>
        btn.classList.contains("second")
    );
    const thirdSolved = [...grid.children].filter(btn =>
        btn.classList.contains("third")
    );
    const fourthSolved = [...grid.children].filter(btn =>
        btn.classList.contains("fourth")
    );
    // All other buttons
    const unsolvedButtons = [...grid.children].filter(btn =>
        !btn.classList.contains("Solved")
    );
    
  
    
    // Reorder grid
    grid.innerHTML = "";

    [...firstSolved, ...secondSolved,...thirdSolved, ...fourthSolved,...unsolvedButtons].forEach(btn => {
      grid.appendChild(btn);
    });};
    function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
async function solveRemaining() {
    let k=solutions;
    for (let i=k; i<4; i++)
    {
     const unsolvedButtons = [...grid.children].filter(btn =>
    !btn.classList.contains("Solved")
);

if (unsolvedButtons.length === 0) {
    console.log("No unsolved buttons left");
    break;
}

let cleanClass = unsolvedButtons[0].className
    .replace(/\bactive\b/g, "")
    .trim();

console.log(cleanClass);
  const matchedButtons = [...grid.children].filter(btn =>
    btn.classList.contains(cleanClass));


Solve(
    matchedButtons,
    cleanClass,
    categories,
    document,
    solutions,
    colorArray
);

solutions++;
await sleep(1500);
    }
}

//Word buttons

const colorArray = ["#e2de5d","#7dc27d", "#969dea","#dc75e7"];
for (let i = 1; i <= 16; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    btn.textContent = words[i-1];
    btn.setAttribute("class", categories[Math.floor((i-1)/4)]);
    
    btn.addEventListener("click", () => {
      if(!btn.className.includes("Solved")){
        if (btn.className.includes("active"))
          selections--;
   
        if (!btn.className.includes("active"))
          if(selections<4)
            selections++;

        if (max==1)
          btn.classList.remove("active");
        else
          btn.classList.toggle("active");
        if(selections==4)
          max=1;
        else 
          max=0;
    
        console.log(selections);
      }
    });
    grid.appendChild(btn);
}
function shuffle(){
  // Fisher-Yates shuffle
  const buttons = Array.from(grid.children);
  const min=4*solutions;
  for (let i = buttons.length- 1; i > min; i--) {
    const j = Math.floor(Math.random() * (i-min + 1)+min);
    [buttons[i], buttons[j]] = [buttons[j], buttons[i]];
  }

  // Rebuild grid in shuffled order
  grid.innerHTML = "";
  buttons.forEach(button => grid.appendChild(button));
}
//Action buttons
document.getElementById("shuffleBtn").addEventListener("click", () => {
    shuffle();
});
document.getElementById("removeBtn").addEventListener("click", () => {
  const buttons = Array.from(grid.children);
  buttons.forEach(btn => btn.classList.remove("active"));
  selections=0;
  max=0;
    
});
document.getElementById("submitBtn").addEventListener("click", () => {
  const buttons = Array.from(grid.children);
  var classes = [];
  // Get active button class
  for (let i = buttons.length-1; i >=0; i--) {
    if (buttons[i].className.includes("active"))
      classes.push(buttons[i].className);
    console.log(classes);
  }
  console.log(classes.length);
  
   if (
    classes.length === 4 &&
    classes.every(c => c === classes[0])
) {
    const matchedClass = classes[0];
    console.log(matchedClass);
      

    // Remove "active" if needed
    const cleanClass = matchedClass.replace(/\bactive\b/g, "").trim();
    console.log(cleanClass);
    

    
      // Buttons that have the matching class
    const matchedButtons = [...grid.children].filter(btn =>
        btn.classList.contains(cleanClass)
        
    );
  console.log(matchedButtons)
    Solve(matchedButtons,cleanClass,categories, document, solutions, colorArray);
    selections=0;
    max=0;
    solutions++;

}
  if (
    classes.length === 4 &&
    !classes.every(c => c === classes[0])
) {
  let stuff = "life-"+lifes.toString();
  lifes--;
  const exactlyThreeEqual = [...new Set(classes)].some(v => classes.filter(c => c === v).length === 3);
  if(exactlyThreeEqual)
    showToast("TRE SU QUATTRO!");

  console.log("lifes" + lifes);
  const element = document.getElementById(stuff);
  element.remove();
  if (lifes==0){
    const buttons = Array.from(grid.children);
    buttons.forEach(btn => btn.classList.remove("active"));
   solveRemaining();
  }
}
});
shuffle();

function showToast(message, duration = 3000) {
  const toast = document.getElementById("toast");

  toast.textContent = message;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, duration);
}
