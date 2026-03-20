let timer;

function startTimer(){

let time=300;

timer=setInterval(()=>{

let minutes=Math.floor(time/60);
let seconds=time%60;

document.getElementById("timer").innerText=
`OTP expires in ${minutes}:${seconds}`;

time--;

if(time<0){

clearInterval(timer);

document.getElementById("timer").innerText="OTP expired";

}

},1000);

}

async function sendOTP(){

const email=document.getElementById("email").value;

const res=await fetch("http://localhost:5000/send-otp",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({email})

});

const data=await res.json();

document.getElementById("message").innerText=data.message;

startTimer();

}

async function verifyOTP(){

const email=document.getElementById("email").value;

const otp=document.getElementById("otp").value;

const res=await fetch("http://localhost:5000/verify-otp",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({email,otp})

});

const data=await res.json();

document.getElementById("message").innerText=data.message;

}