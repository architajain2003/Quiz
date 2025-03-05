// Selecting all required elements
const start_btn = document.querySelector(".start_btn button");
const info_box = document.querySelector(".info_box");
const exit_btn = info_box.querySelector(".buttons .quit");
const continue_btn = info_box.querySelector(".buttons .restart");
const quiz_box = document.querySelector(".quiz_box");
const result_box = document.querySelector(".result_box");
const option_list = document.querySelector(".option_list");
const time_line = document.querySelector("header .time_line");
const timeText = document.querySelector(".timer .time_left_txt");
const timeCount = document.querySelector(".timer .timer_sec");

// Start quiz
start_btn.onclick = () => {
    info_box.classList.add("activeInfo"); // Show info box
}

// Exit quiz
exit_btn.onclick = () => {
    info_box.classList.remove("activeInfo"); // Hide info box
}

// Continue quiz
continue_btn.onclick = () => {
    info_box.classList.remove("activeInfo"); // Hide info box
    quiz_box.classList.add("activeQuiz"); // Show quiz box
    shuffleQuestions(); // Shuffle and select questions
    showQuestions(0); // Show the first question
    queCounter(1); // Show question count
    startTimer(15); // Start the timer
    startTimerLine(0); // Start the timer line
}

let timeValue = 15;
let que_count = 0;
let que_numb = 1;
let userScore = 0;
let counter;
let counterLine;
let widthValue = 0;
const totalQuestions = 5; // Limit to 5 questions

const restart_quiz = result_box.querySelector(".buttons .restart");
const quit_quiz = result_box.querySelector(".buttons .quit");

// Restart quiz
restart_quiz.onclick = () => {
    quiz_box.classList.add("activeQuiz"); // Show quiz box
    result_box.classList.remove("activeResult"); // Hide result box
    timeValue = 15;
    que_count = 0;
    que_numb = 1;
    userScore = 0;
    widthValue = 0;
    shuffleQuestions(); // Shuffle and select questions
    showQuestions(que_count); // Show the first question
    queCounter(que_numb); // Show question count
    clearInterval(counter); // Clear the counter
    clearInterval(counterLine); // Clear the counter line
    startTimer(timeValue); // Start the timer
    startTimerLine(widthValue); // Start the timer line
    timeText.textContent = "Time Left"; // Change the text of timeText
    next_btn.classList.remove("show"); // Hide the next button
}

// Quit quiz
quit_quiz.onclick = () => {
    window.location.reload(); // Reload the current window
}

const next_btn = document.querySelector("footer .next_btn");
const bottom_ques_counter = document.querySelector("footer .total_que");

// Next question
next_btn.onclick = () => {
    if (que_count < totalQuestions - 1) { // If questions are less than total
        que_count++; // Increment question count
        que_numb++; // Increment question number
        showQuestions(que_count); // Show the next question
        queCounter(que_numb); // Update question counter
        clearInterval(counter); // Clear the counter
        clearInterval(counterLine); // Clear the counter line
        startTimer(timeValue); // Restart timer
        startTimerLine(widthValue); // Restart timer line
        timeText.textContent = "Time Left"; // Change the time text
        next_btn.classList.remove("show"); // Hide the next button
    } else {
        clearInterval(counter); // Clear the counter
        clearInterval(counterLine); // Clear the counter line
        showResult(); // Show the result
    }
}

// Shuffle the questions array randomly
let shuffledQuestions = [];
function shuffleQuestions() {
    shuffledQuestions = [...questions]; // Create a copy of the questions array
    shuffledQuestions = shuffledQuestions.sort(() => Math.random() - 0.5); // Shuffle the questions
    shuffledQuestions = shuffledQuestions.slice(0, totalQuestions); // Limit to 5 questions
}

// Show the current question
function showQuestions(index) {
    const que_text = document.querySelector(".que_text");

    // Create HTML for the question and options
    let que_tag = '<span>' + shuffledQuestions[index].numb + ". " + shuffledQuestions[index].question + '</span>';
    let option_tag = shuffledQuestions[index].options.map(option => 
        `<div class="option"><span>${option}</span></div>`
    ).join('');
    
    que_text.innerHTML = que_tag; // Add the question to the page
    option_list.innerHTML = option_tag; // Add the options to the page
    
    const option = option_list.querySelectorAll(".option");

    // Add click event to each option
    for (let i = 0; i < option.length; i++) {
        option[i].setAttribute("onclick", "optionSelected(this)");
    }
}

// Create icons for correct and incorrect answers
let tickIconTag = '<div class="icon tick"><i class="fas fa-check"></i></div>';
let crossIconTag = '<div class="icon cross"><i class="fas fa-times"></i></div>';

// When an option is selected
function optionSelected(answer) {
    clearInterval(counter); // Clear the counter
    clearInterval(counterLine); // Clear the counter line
    let userAns = answer.textContent; // Get user selected option
    let correcAns = shuffledQuestions[que_count].answer; // Get correct answer
    const allOptions = option_list.children.length; // Get all options
    
    // Check if the user selected the correct option
    if (userAns === correcAns) {
        userScore += 1; // Increase score
        answer.classList.add("correct"); // Add correct class
        answer.insertAdjacentHTML("beforeend", tickIconTag); // Add tick icon
        console.log("Correct Answer");
    } else {
        answer.classList.add("incorrect"); // Add incorrect class
        answer.insertAdjacentHTML("beforeend", crossIconTag); // Add cross icon
        console.log("Wrong Answer");

        // Auto-select the correct option
        for (let i = 0; i < allOptions; i++) {
            if (option_list.children[i].textContent === correcAns) {
                option_list.children[i].setAttribute("class", "option correct");
                option_list.children[i].insertAdjacentHTML("beforeend", tickIconTag);
                console.log("Auto selected correct answer.");
            }
        }
    }

    // Disable all options after selection
    for (let i = 0; i < allOptions; i++) {
        option_list.children[i].classList.add("disabled");
    }

    // Show the next button
    next_btn.classList.add("show");
}

// Show the result at the end of the quiz
function showResult() {
    info_box.classList.remove("activeInfo");
    quiz_box.classList.remove("activeQuiz");
    result_box.classList.add("activeResult");
    const scoreText = result_box.querySelector(".score_text");

    // Show appropriate message based on score
    let scoreTag = '';
    if (userScore > 3) {
        scoreTag = `<span>Congrats! , You got <p>${userScore}</p> out of <p>${totalQuestions}</p></span>`;
    } else if (userScore > 1) {
        scoreTag = `<span>Nice , You got <p>${userScore}</p> out of <p>${totalQuestions}</p></span>`;
    } else {
        scoreTag = `<span>Sorry , You got only <p>${userScore}</p> out of <p>${totalQuestions}</p></span>`;
    }

    scoreText.innerHTML = scoreTag;
}

// Start timer countdown
function startTimer(time) {
    counter = setInterval(timer, 1000);
    function timer() {
        timeCount.textContent = time;
        time--;
        if (time < 9) {
            let addZero = timeCount.textContent;
            timeCount.textContent = "0" + addZero;
        }
        if (time < 0) {
            clearInterval(counter);
            timeText.textContent = "Time Off";
            const allOptions = option_list.children.length;
            let correcAns = shuffledQuestions[que_count].answer;
            for (let i = 0; i < allOptions; i++) {
                if (option_list.children[i].textContent === correcAns) {
                    option_list.children[i].setAttribute("class", "option correct");
                    option_list.children[i].insertAdjacentHTML("beforeend", tickIconTag);
                }
            }
            for (let i = 0; i < allOptions; i++) {
                option_list.children[i].classList.add("disabled");
            }
            next_btn.classList.add("show");
        }
    }
}

// Start the timer line
function startTimerLine(time) {
    counterLine = setInterval(timer, 29);
    function timer() {
        time += 1;
        time_line.style.width = time + "px";
        if (time > 549) {
            clearInterval(counterLine);
        }
    }
}

// Update question counter
function queCounter(index) {
    let totalQueCounTag = `<span><p>${index}</p> of <p>${totalQuestions}</p> Questions</span>`;
    bottom_ques_counter.innerHTML = totalQueCounTag;
}
