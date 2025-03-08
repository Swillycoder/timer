const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = 600;  
canvas.height = 500;

const sounds = { 
    alarm1 : new Audio('audio/alarm1.wav'),
    alarm2 : new Audio('audio/alarm2.wav'),
    alarm3 : new Audio('audio/rooster.wav'),
}

let isMuted = false;
const muteButton = document.getElementById("muteButton");

let selectedSound = 'alarm1';

const inputField = document.getElementById("inputField");

const buttons = [
    { x: canvas.width/2 - 200, y: 425, width: 100, height: 40, label: "Alarm 1", sound: "alarm1" },
    { x: canvas.width/2 - 50, y: 425, width: 100, height: 40, label: "Alarm 2", sound: "alarm2" },
    { x: canvas.width/2 + 100, y: 425, width: 100, height: 40, label: "Alarm 3", sound: "alarm3" },
];

class Timer {
    constructor (countdownDuration, alarmSound) {
        this.width = 550;
        this.height = 200;
        this.setCountdown(countdownDuration);
        this.alarmSound = alarmSound;
    }

    setCountdown(duration) {
        this.countdownStart = Date.now();
        this.countdownDuration = duration * 1000;
        this.timeRemaining = Math.ceil(duration);
        this.draw();
    }

    formatTime(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;

        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    draw() {
        ctx.fillStyle = 'black';
        ctx.fillRect(canvas.width/2 - this.width/2 ,canvas.height/2 - this.height/2,this.width,this.height);
        ctx.fillStyle = 'red';
        ctx.font = '150px "Digital-7", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(this.formatTime(this.timeRemaining), canvas.width / 2, canvas.height / 2 + 50);

        drawSoundButtons();
    }

    update() {
        const now = Date.now();
        const elapsedTime = now - this.countdownStart;
        this.timeRemaining = Math.max(0, Math.ceil((this.countdownDuration - elapsedTime) / 1000));
        this.draw();

        if (this.timeRemaining <= 0) {
            sounds[selectedSound].play();
        }
    }
}

const timer = new Timer(10);

function drawSoundButtons() {
    buttons.forEach(button => {
        ctx.fillStyle = button.sound === selectedSound ? "green" : "black";
        ctx.fillRect(button.x, button.y, button.width, button.height);
        ctx.fillStyle = "white";
        ctx.font = "25px Digital-7";
        ctx.textAlign = "center";
        ctx.fillText(button.label, button.x + button.width / 2, button.y + 25);
    });
}

function secondsToTimeFormat(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${padZero(hours)}:${padZero(minutes)}:${padZero(remainingSeconds)}`;
}

function parseTimeInput(timeString) {
    const timeParts = timeString.trim().split(':');

    if (timeParts.length === 1 && !isNaN(timeParts[0])) {
        const totalSeconds = parseInt(timeParts[0], 10);

        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        return `${padZero(hours)}:${padZero(minutes)}:${padZero(seconds)}`;
    }

    if (timeParts.length === 3) {
        const hours = parseInt(timeParts[0], 10);
        const minutes = parseInt(timeParts[1], 10);
        const seconds = parseInt(timeParts[2], 10);

        if (!isNaN(hours) && !isNaN(minutes) && !isNaN(seconds) &&
            hours >= 0 && minutes >= 0 && seconds >= 0 &&
            minutes < 60 && seconds < 60) {
            return `${padZero(hours)}:${padZero(minutes)}:${padZero(seconds)}`;
        }
    }
    return null;
}

function padZero(num) {
    return num < 10 ? `0${num}` : num;
}


function timerLoop() {
    ctx.clearRect(0,0, canvas.width, canvas.height)
    ctx.fillStyle = "rgb(8, 4, 39)"
    ctx.fillRect(0,0,canvas.width, canvas.height)

    timer.update();

    requestAnimationFrame(timerLoop);
}

timerLoop();

setInterval(function () {
    timer.update();
}, 1000);

inputField.addEventListener("change", function () {
    const userInput = inputField.value;
    const formattedTime = parseTimeInput(userInput);

    if (formattedTime !== null) {
        const [hours, minutes, seconds] = formattedTime.split(':').map(Number);
        const totalSeconds = hours * 3600 + minutes * 60 + seconds;
        timer.setCountdown(totalSeconds);
    } else {
        alert("Invalid time format. Please enter in hh:mm:ss format.");
    }
});

canvas.addEventListener("click", function (event) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    buttons.forEach(button => {
        if (
            mouseX >= button.x &&
            mouseX <= button.x + button.width &&
            mouseY >= button.y &&
            mouseY <= button.y + button.height
        ) {
            selectedSound = button.sound;
        }
    });
});

muteButton.addEventListener("click", function () {
    isMuted = !isMuted; // Toggle mute state

    for (let key in sounds) {
        sounds[key].volume = isMuted ? 0 : 1;
    }

    muteButton.textContent = isMuted ? "Unmute" : "Mute";
});
