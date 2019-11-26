const hoursField = document.getElementById("hours");
const minutesField = document.getElementById("minutes");
const secondsField = document.getElementById("seconds");

const startButton = document.getElementById("start-button");
const resetButton = document.getElementById("reset-button");

const progressBar = document.getElementsByTagName("hr")[0];

const colons = document.getElementsByClassName("colon");

const timerDoneAudio = new Audio("done.wav");

hoursField.onkeyup = () => {
    validatePattern(hoursField, "hours");
    validatePattern(minutesField, "minutes");
    validatePattern(secondsField, "seconds");
}

hoursField.onkeydown = (event) => {
    validateLength(hoursField);
    validateKey(event);
}

minutesField.onkeyup = () => {
    validatePattern(hoursField, "hours");
    validatePattern(minutesField, "minutes");
    validatePattern(secondsField, "seconds");
}

minutesField.onkeydown = (event) => {
    validateLength(minutesField);
    validateKey(event);
}

secondsField.onkeyup = () => {
    validatePattern(hoursField, "hours");
    validatePattern(minutesField, "minutes");
    validatePattern(secondsField, "seconds");
}

secondsField.onkeydown = (event) => {
    validateLength(secondsField);
    validateKey(event);
}

resetButton.addEventListener("click", resetTimer);

function resetTimer() {
    clearInterval(interval);
    enableEditing();
    updateTime();
    updateProgressBar(1, 1);
    enableOrDisableStartButton();
    removeAnimation();

    isPaused = true;
    hours = minutes = seconds = 0;
    totalRemainingTime = totalTime = null;
    timerDoneAudio.pause();
    timerDoneAudio.currentTime = 0;
    hoursField.classList.remove("invalid");
    minutesField.classList.remove("invalid");
    secondsField.classList.remove("invalid");
    startButton.innerHTML = "START";
}

let isPaused = true;
let totalTime, totalRemainingTime, hours, minutes, seconds, interval;

startButton.addEventListener("click", startTimer);

function startTimer() {
    isPaused = !isPaused;
    disableEditing();
    startButton.innerHTML = startButton.innerHTML == "PAUSE" ? "START" : "PAUSE";
    totalRemainingTime = getTotalTime();

    if (!totalTime) {
        totalTime = totalRemainingTime;
    }

    if (isPaused) {
        clearInterval(interval);
    } else {
        interval = setInterval(() => {
            getRemainingTime();
            updateTime();
            updateProgressBar(totalRemainingTime, totalTime);
            if (hours == 0 && minutes == 0 && seconds == 0) {
                disableStartButton();
                clearInterval(interval);
                timerDone();
                setTimeout(() => {
                    resetTimer();
                }, 3000);
            }
        }, 1000);
    }
}

function getTotalTime() {
    let hours = Number(hoursField.innerHTML) * 60 * 60;
    let minutes = Number(minutesField.innerHTML) * 60;
    let seconds = Number(secondsField.innerHTML);
    return hours + minutes + seconds;
}

function getRemainingTime() {
    hours = Math.floor(--totalRemainingTime / (60 * 60));
    minutes = Math.floor((totalRemainingTime - hours * 60 * 60) / 60);
    seconds = totalRemainingTime - (hours * 60 * 60) - (minutes * 60);
}

function updateTime() {
    hoursField.innerHTML = String(hours).length == 1 ? `0${hours}` : hours;
    minutesField.innerHTML = String(minutes).length == 1 ? `0${minutes}` : minutes;
    secondsField.innerHTML = String(seconds).length == 1 ? `0${seconds}` : seconds;
}

function disableEditing() {
    hoursField.contentEditable = false;
    minutesField.contentEditable = false;
    secondsField.contentEditable = false;
}

function enableEditing() {
    hoursField.contentEditable = true;
    minutesField.contentEditable = true;
    secondsField.contentEditable = true;
}

function disableStartButton() {
    startButton.disabled = true;
    startButton.style.opacity = "0.5";
    startButton.style.cursor = "not-allowed";
}

function enableStartButton() {
    startButton.disabled = false;
    startButton.style.opacity = "1";
    startButton.style.cursor = "pointer";
}

function updateProgressBar(remaining, total) {
    progressBar.style.width = `${(remaining / total) * 100}%`;
}

function timerDone() {
    timerDoneAudio.play();
    for (let i = 0; i < colons.length; i++) {
        colons[i].style.animation = "blink 1s 3 steps(1)";
    }
}

function removeAnimation() {
    for (let i = 0; i < colons.length; i++) {
        colons[i].style.animation = "";
    }
}

function isValid(input) {
    switch (input) {
        case "seconds":
            return (getTotalTime() ? (/^[0-5]?[0-9]$/.test(secondsField.innerHTML)) : (/^(0?[1-9]|[1-4][0-9]|5[0-9])$/.test(secondsField.innerHTML)));
        case "minutes":
            return ((/^[0-5]?[0-9]$/.test(minutesField.innerHTML)));
        case "hours":
            return ((/^(2[0-3]|[01]?[0-9])$/.test(hoursField.innerHTML)));
    }
}

function validatePattern(field, input) {
    if (field.innerHTML.length >= 1) {
        if (isValid(input)) {
            field.classList.remove("invalid");
            enableOrDisableStartButton();
        } else {
            field.classList.add("invalid");
            enableOrDisableStartButton();
        }
    }
}

function enableOrDisableStartButton() {
    if (isValid("seconds") && isValid("minutes") && isValid("hours")) {
        enableStartButton();
    } else {
        disableStartButton();
    }
}

function validateLength(field) {
    if (field.innerHTML.length >= 2) {
        field.innerHTML = "";
    }
}

function validateKey(event) {
    if (/\D/.test(event.key)) {
        event.preventDefault();
    }
}