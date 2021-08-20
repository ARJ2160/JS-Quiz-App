//jshint esversion: 6

const start_button = document.querySelector(".click");
const quiz_box = document.querySelector(".quiz-box");
const quiz_que = document.querySelector(".quiz-question");
const options = document.querySelector(".options-list");
const timeCount = document.querySelector(".timer .time_sec");
const timeText = document.querySelector(".timer .time_text");
const complete_text = document.querySelector(".complete_text");
const score_text = document.querySelector(".score_text");
const medal = document.querySelector(".icon");
const box = document.querySelector(".shadow-box");
const text= document.querySelectorAll(".disappear-box");

let que_count = 0;
let que_numb = 1;
let counter;
let timeValue = 10;
let widthValue = 0;
let score = 0;
var refresh;
let acceptable_score = 3;

const next_btn = document.querySelector(".next_btn");
const result_box = document.querySelector(".result_box");
const restart_quiz = result_box.querySelector(".buttons .restart");
const download_btn = document.querySelector(".result_box .download_btn");

let tickicon = `<div class="icon tick"><i class="fas fa-check"></i></div>`;
let crossicon = `<div class="icon cross"><i class="fas fa-times"></i></div>`;

// <-----------------------------------------------------Checking Button Presses ------------------------------------------------------>
// If Restart Button is clicked
restart_quiz.onclick = () => {
    window.location.reload();
}

//If Start Button is clicked
start_button.onclick = () => {
      
    box.classList.toggle('increase-box');
 
    text.forEach(e => {
        return e.classList.toggle('poof');
    });

    // Make Quiz questions appear
    quiz_box.classList.add("appear");
    
    refresh = setInterval(updateTimer, 1000);
    showQuestions(0);
    questionCounter(1);
    startTimer(10);
};

//If Next Button in Quiz is pressed
next_btn.onclick = () => {
    if(que_count < questions.length - 1){
        que_count++;
        que_numb++;
        showQuestions(que_count);
        questionCounter(que_numb);
        clearInterval(counter);
        startTimer(timeValue);
        next_btn.style.display = "none";
    }
    else{
        showResultBox(score, time);
        clearInterval(refresh);
        count.style.display = "none";
    }//If questions are over
}

// <------------------------------------------------------- Checking Answers/ Quiz Calculations --------------------------------------->
//Display Questions and Options
function showQuestions(index){
    
    let que_tag = ' <span>'+ questions[index].id + "." + questions[index].question + '</span>'
    let option_tag = '<div class="option">' + questions[index].options[0] + '</div>'
                    +'<div class="option">' + questions[index].options[1] + '</div>'
                    +'<div class="option">' + questions[index].options[2] + '</div>'
                    +'<div class="option">' + questions[index].options[3] + '</div>'

    quiz_que.innerHTML = que_tag;
    options.innerHTML = option_tag;
    const option = options.querySelectorAll(".option");
    for(let i = 0; i < option.length; i++){
        option[i].setAttribute("onclick", "optionSelected(this)");
    }
}

//Checks weather selected option is correct or not
function optionSelected(answer){

    clearInterval(counter);

    let userAns = answer.innerHTML;
    let correctAns = questions[que_count].answer;
    let allOptions = options.children.length;

    if(userAns === correctAns){
        score += 1;

        markCorrect(answer);
    }else{
        markWrong(answer);
    }
    //Disable all optionSelected
    for (let i = 0; i < allOptions; i++) {
        options.children[i].classList.add("disabled");  
    }
    next_btn.style.display = "block";
}

//Marks the right answer automatically
function markCorrect(answer){
    answer.classList.add("correct");
    answer.insertAdjacentHTML("beforeend", tickicon);
}

//Marks the wrong answer automatically
function markWrong(answer){
    answer.classList.add("incorrect");
    answer.insertAdjacentHTML("beforeend", crossicon);
    
    //To mark the correct one if user chooses wrong
    for (let i = 0; i < options.children.length; i++){
        if(options.children[i].textContent === questions[que_count].answer){
            options.children[i].setAttribute("class", "option correct");
        }
    }
}
// <------------------------------------------------------- Starting the Timer in Quiz Box --------------------------------------->
function startTimer(time){

    timeText.textContent = "Time Left :- ";
    counter = setInterval(timer, 1000);

    function timer(){

        timeCount.textContent = time;
        time--; 

        if(time < 0){
            clearInterval(counter);
            timeCount.textContent = "00";
            timeText.textContent = "Timed Out!";
            //To mark the correct one if user does not choose
            for (let i = 0; i < options.children.length; i++){
                if(options.children[i].textContent === questions[que_count].answer){
                    options.children[i].setAttribute("class", "option correct");
                }
            }
            //Disable all optionSelected
            disableOptions();
            next_btn.style.display = "block"; 
        }
    }
}
// <------------------------------------------------------- External Timer ---------------------------------------------------------->
const startMinute = 0.2;
let time = startMinute * 60;

const count = document.getElementById('time');

function updateTimer(){
    const minutes = Math.floor(time / 60);
    let seconds = time % 60;

    time--;

    if(startMinute < 9 && time < 9){
        count.innerHTML = `0${minutes}:0${seconds}`;
    }else{
        count.innerHTML = `${minutes}:${seconds}`;
    }
    if(time < 0){
        count.style.display = "none";
        clearInterval(refresh);
        showResultBox(score, time);
    }
}
// <------------------------------------------------------- Showing Results ------------------------------------------------>
function showResultBox(score, time){

    quiz_box.style.display = "none";//Hide the Quiz Box 
    result_box.style.display = "block";//Show the Result Box

    if(score >= acceptable_score){ 

        console.log("1");

        medal.innerHTML = '<i class="fas fa-icon fa-medal"></i>';

        score_text.innerHTML = '<h2 class="congrats">Congratulations!</h2><span> You scored '+ score +' out of '+ questions.length +'</span>';
    }
    // else if(score >= 3 && time > 0){

    //     medal.innerHTML = '<i class="fas fa-icon fa-medal"></i>';

    //     score_text.innerHTML = '<h3 class="congrats">Congratulations!</h3><span><p> You scored </p><p>'+ score +'</p> out of <p>'+ questions.length +'</p></span>';
    // }
    else if(score < acceptable_score && time > 0){

        console.log("3");

        medal.innerHTML = '<i class="fas fa-clock"></i>';
        complete_text.innerHTML = "";

        score_text.innerHTML = '<h2>Please retake the test as your score was not high enough to qualify for the certificate. Your score is </h2><div class="score-display">'+ score +' out of '+ questions.length +'</div><p>Please take the test again and score above 3 to download the certificate.</p>';

        download_btn.style.display = "none";
    }
    else if(score < acceptable_score && time <= 0){

        console.log("4");

        medal.innerHTML = '<i class="fas fa-clock"></i>';
        complete_text.innerHTML = "";

        score_text.innerHTML = '<h2> Oops! You ran out of time and your score was not high enough to qualify for the certificate. Your score is </h2><div class="score-display">'+ score +' out of '+ questions.length +'</div><h3>Please take the test again and score above 3 to download the certificate</span></h3>';

        download_btn.style.display = "none";
    }
}
// <------------------------------------------------------- Footer Questions Counter --------------------------------------->
function questionCounter(index){
    const button_counter = quiz_box.querySelector(".total_que");
    let total_count = '<span><p>'+ index +'</p> / <p>'+ questions.length +'</p>Questions</span>';

    button_counter.innerHTML = total_count;
} 
// <------------------------------------------------------- Function to disable all options --------------------------------->
function disableOptions(){
    for (let i = 0; i < options.children.length; i++) {
        options.children[i].classList.add("disabled");  
    }
}