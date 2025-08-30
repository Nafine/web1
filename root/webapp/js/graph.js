const canvas = document.getElementById("graph");
const ctx = canvas.getContext("2d");

const radius = canvas.width * 0.4;

$(document).ready(draw)

function initStyles() {
    ctx.fillStyle = "rgb(51 153 255)";
    ctx.strokeStyle = "rgb(0 0 0)";
}

function draw() {
    initStyles()

    drawShape();

    drawAxis();
    drawArrows();

    drawLabels();
}

const labels = [
    {text: "R", x: radius, y: 0},
    {text: "R", x: 0, y: -radius},

    {text: "R/2", x: radius / 2, y: 0},
    {text: "R/2", x: 0, y: -radius / 2},

    {text: "-R", x: -radius, y: 0},
    {text: "-R", x: 0, y: radius},
    {text: "-R/2", x: -radius / 2, y: 0},
    {text: "-R/2", x: 0, y: radius / 2},
]

function drawLabels() {
    const shift = 5;

    try {
        ctx.save();
        ctx.font = "18px serif";
        ctx.fillStyle = "black";
        labels.forEach(label => {
            ctx.fillText(label.text, canvas.width / 2 + label.x + shift, canvas.height / 2 + label.y - shift);
            drawTick(label);
        })
    } finally {
        ctx.restore();
    }
}

function drawTick(label) {
    const tickLength = 5;
    if (label.x === 0) {
        drawLine(
            {x: canvas.width / 2 + tickLength, y: canvas.height / 2 + label.y},
            {x: canvas.width / 2 - tickLength, y: canvas.height / 2 + label.y});
    } else {
        drawLine(
            {x: canvas.width / 2 + label.x, y: canvas.height / 2 + tickLength},
            {x: canvas.width / 2 + label.x, y: canvas.height / 2 - tickLength},);
    }
}

function drawLine(from, to) {
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
}

function drawAxis() {
    ctx.beginPath();
    //Y-axis
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    //X-axis
    ctx.moveTo(0, canvas.height / 2);
    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.stroke();
}

function drawArrows() {
    ctx.beginPath();
    //Y-axis arrow
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2 - canvas.width / 100, canvas.height / 50);
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2 + canvas.width / 100, canvas.height / 50);
    //X-axis arrow
    ctx.moveTo(canvas.width, canvas.height / 2);
    ctx.lineTo(canvas.width - canvas.width / 50, canvas.height / 2 - canvas.height / 100);
    ctx.moveTo(canvas.width, canvas.height / 2);
    ctx.lineTo(canvas.width - canvas.width / 50, canvas.height / 2 + canvas.height / 100);
    ctx.stroke();
}

function drawShape() {
    drawCircle(canvas.width / 2, canvas.height / 2, 0, 3 * Math.PI / 2);
    ctx.beginPath();
    ctx.fillRect(canvas.width / 2, canvas.height / 2, radius, radius / 2);
    drawTriangle(
        {x: canvas.width / 2, y: canvas.height / 2},
        {x: canvas.width / 2 - radius, y: canvas.height / 2},
        {x: canvas.width / 2, y: canvas.height / 2 + radius}
    );
}

function drawTriangle(p1, p2, p3) {
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.lineTo(p3.x, p3.y);
    ctx.closePath();
    ctx.fill();
}

function drawCircle(x, y, startAngle, endAngle) {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.arc(x, y, radius, startAngle, endAngle, true);
    ctx.fill();
}