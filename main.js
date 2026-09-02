import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";

import {getDatabase, ref, get, query, orderByKey, limitToLast, endAt} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-database.js";
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
console.log("here");
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);



function formatDate(date) {
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const yyyy = date.getFullYear();
    return `${yyyy}_${mm}_${dd}`;
}

function toDisplayDate(dateString) {
  const [yyyy, mm, dd] = dateString.split("_");
  return `${dd}_${mm}_${yyyy}`;
}

const first_date = new Date(2026, 5, 18)
let date = new Date();
const today = date;
console.log("this");
let snapshot;

while (true) {
    const path = formatDate(date);
    snapshot = await get(ref(db, path));

    if (snapshot.exists()) {
        console.log(`Found data for ${path}`);
        console.log(snapshot.val());
        break;
    }

    // Go back one day
    date.setDate(date.getDate() - 1);
}
console.log("there");
document.getElementById("giocaBtn").onclick = () => {
  document.body.style.backgroundColor= 'rgb(' + [255,255,251].join(',') + ')';
  document.getElementById("landing").style.display = "none";
  document.getElementById("archive").style.display = "none";
  document.getElementById("game").style.display = "flex";
  game(formatDate(date), snapshot);
};

const indietroBtn = document.querySelectorAll(".indietroBtn");

indietroBtn.forEach(element => {
  element.addEventListener("click", () => {
    document.body.style.backgroundColor= 'rgb(' + [152, 203, 136].join(',') + ')';
    document.getElementById("landing").style.display = "flex";
    document.getElementById("archive").style.display = "none";
    document.getElementById("game").style.display = "none";
  });
})

document.getElementById("archivioBtn").onclick = () => {
  document.getElementById("landing").style.display = "none";
  document.getElementById("archive").style.display = "flex";
  document.getElementById("game").style.display = "none";
  loadDays(today);
};


async function loadDays(today) {
document.getElementById("caricamento").style.display="inline";
const todayKey = formatDate(today);

const q = query(
    ref(db),
    orderByKey(),
    endAt(todayKey),
    limitToLast(80)
);

const snapshot = await get(q);
const puzzles = [];

snapshot.forEach(child => {
  puzzles.push(child);
});

puzzles.reverse();

puzzles.forEach(child => {
    console.log(child.key);
    console.log(child.val());
    const button = document.createElement("button");
  button.classList.add("day");
  const daysContainer=document.getElementById("daysContainer");
  const caricamento=document.getElementById("caricamento");

  const dateText = document.createElement("h2");

  button.textContent = toDisplayDate(child.key).replaceAll("_", "/");

  button.addEventListener("click", () => {
    document.body.style.backgroundColor= 'rgb(' + [255,255,251].join(',') + ')';
    document.getElementById("landing").style.display = "none";
    document.getElementById("archive").style.display = "none";
    document.getElementById("game").style.display = "flex";

    game(child.key, child);   
  });

  daysContainer.insertBefore(button, caricamento);
});
  document.getElementById("caricamento").style.display="none";
};
function game(giorno, snapshot){
  const grid = document.getElementById("grid");
  grid.innerHTML = "";

  // Reset solution panels
  ["one","two","three","four"].forEach(id => {
    const el = document.getElementById(id);
    el.innerHTML = "";
    el.style.opacity = "0";
    el.style.backgroundColor = "";
  });

 
  const life_lost = document.querySelectorAll(".lost");

life_lost.forEach(element => {
    element.classList.remove("lost");
});

const data = snapshot.val();
const cat = Object.keys(data);
const categories = cat.flatMap(str => str.slice(1).replaceAll(" ", "+"));
const wrd = Object.values(data);
const words = wrd.flatMap(str => str.split(", "));

const firma=document.getElementById("data");

firma.textContent="Connessione del giorno: " + toDisplayDate(giorno).replaceAll("_","/");
var selections=0;
var max=0;
var solutions=0;
var lifes =4;


function shake(div){
    $('#div').animate({
        'margin-left': '-=5px',
        'margin-right': '+=5px'
    }, 200, function() {
        $('#div').animate({
            'margin-left': '+=5px',
            'margin-right': '-=5px'
        }, 200, function() {
        });
    });
}
function Solve(matchedButtons,cleanClass,categories, document, solutions, colorArray, cat, numbers){
  var text=[];
  const index = categories.indexOf(cleanClass);
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
  })
};

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function solveRemaining() {
  let k=solutions;
  for (let i=k; i<4; i++){
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

function showToast(message, duration = 3000) {
  const toast = document.getElementById("toast");

  toast.textContent = message;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, duration);
}

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
document.getElementById("shuffleBtn").onclick = () => {
  shuffle();
};

document.getElementById("removeBtn").onclick = () => {
  const buttons = Array.from(grid.children);
  buttons.forEach(btn => btn.classList.remove("active"));
  selections=0;
  max=0;
};

document.getElementById("submitBtn").onclick = () => {
  const buttons = Array.from(grid.children);
  var classes = [];
  // Get active button class
  for (let i = buttons.length-1; i >=0; i--) {
    if (buttons[i].className.includes("active"))
      classes.push(buttons[i].className);
  }
  const matchedClass = classes[0];

  // Remove "active" if needed
  const cleanClass = matchedClass.replace(/\bactive\b/g, "").trim();

  // Buttons that have the matching class
  const matchedButtons = [...grid.children].filter(btn =>
    btn.classList.contains(cleanClass)
  );
  
  if (
    classes.length === 4 &&
    classes.every(c => c === classes[0])
  ){
    
    Solve(matchedButtons,cleanClass,categories, document, solutions, colorArray);
    selections=0;
    max=0;
    solutions++;
  }
  if (
    classes.length === 4 &&
    !classes.every(c => c === classes[0])
  ){

    let stuff = "life-"+lifes.toString();
    lifes--;
    const exactlyThreeEqual = [...new Set(classes)].some(v => classes.filter(c => c === v).length === 3);
    if(exactlyThreeEqual){
      showToast("TRE SU QUATTRO!");
      let toast=document.getElementById("toast");
      toast.classList.contains("active");
    
      toast.classList.add("vibrate");

      // Remove class after animation ends so it can be triggered again
      toast.addEventListener(
      "animationend",
      () => toast.classList.remove("vibrate"),
      { once: true })
      };
    console.log("lifes" + lifes);
    const element = document.getElementById(stuff);
    element.classList.add("lost");
    if (lifes!=0){
    const activeButtons = [...grid.children].filter(btn =>
      btn.classList.contains("active"));
    
    activeButtons.forEach(btn => {
      btn.classList.add("vibrate");

      // Remove class after animation ends so it can be triggered again
      btn.addEventListener(
      "animationend",
      () => btn.classList.remove("vibrate"),
      { once: true }
      
    )});
    } 
    

    if (lifes==0){
      const buttons = Array.from(grid.children);
      buttons.forEach(btn => btn.classList.remove("active"));
      solveRemaining();
    }
  }
};

shuffle();
}
game(formatDate(date), snapshot);

