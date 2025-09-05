const canvas = document.getElementById("graph");
const ctx = canvas.getContext("2d");

const canvasCfg = {
    radius: canvas.width * 0.4,
    shift: 10
}

$(draw)

function initStyles() {
    ctx.fillStyle = "rgba(51,153,255,0.5)";
    ctx.strokeStyle = "rgba(0,0,0,1)";
    ctx.font = "18px Roboto";
}

function refresh(r) {
    labelCfg.r = r;
    draw(r);
}

function draw(radius = 1) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    initStyles()

    drawShape();

    drawAxis();
    drawArrows();

    drawText(radius);
}

function drawShape() {
    drawCircle(canvas.width / 2, canvas.height / 2, 0, Math.PI / 2);
    ctx.beginPath();
    ctx.fillRect(canvas.width / 2 - canvasCfg.radius, canvas.height / 2, canvasCfg.radius, canvasCfg.radius / 2);
    drawTriangle(
        {x: canvas.width / 2, y: canvas.height / 2},
        {x: canvas.width / 2 + canvasCfg.radius, y: canvas.height / 2},
        {x: canvas.width / 2, y: canvas.height / 2 - canvasCfg.radius});
}

function drawCircle(x, y, startAngle, endAngle) {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.arc(x, y, canvasCfg.radius, startAngle, endAngle);
    ctx.fill();
}

function drawTriangle(p1, p2, p3) {
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.lineTo(p3.x, p3.y);
    ctx.closePath();
    ctx.fill();
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

const labelCfg = {
    r: 1,
    labels: [
        {mult: 1, x: canvasCfg.radius, y: 0},
        {mult: 1, x: 0, y: canvasCfg.radius},

        {mult: 0.5, x: canvasCfg.radius / 2, y: 0},
        {mult: 0.5, x: 0, y: canvasCfg.radius / 2},

        {mult: -1, x: -canvasCfg.radius, y: 0},
        {mult: -1, x: 0, y: -canvasCfg.radius},

        {mult: -0.5, x: -canvasCfg.radius / 2, y: 0},
        {mult: -0.5, x: 0, y: -canvasCfg.radius / 2}
    ]
}

function drawText() {
    drawLabels();
    drawAxisSymbols();
}

function drawLabels() {
    ctx.save();
    ctx.fillStyle = "black";
    labelCfg.labels.forEach(label => {
        drawLabel(label);
        drawTick(label);
    })
    ctx.restore();
}

function drawLabel(label) {
    let shiftX = label.x === 0 ? canvasCfg.shift : 0;
    let shiftY = label.y === 0 ? canvasCfg.shift : 0;

    let radius = Math.round(label.mult * labelCfg.r * 100) / 100;

    ctx.fillText(radius.toString(), canvas.width / 2 + label.x + shiftX, canvas.height / 2 - label.y - shiftY);
}

function drawTick(label) {
    const tickLength = 5;
    if (label.x === 0) {
        drawLine({x: canvas.width / 2 + tickLength, y: canvas.height / 2 + label.y}, {
            x: canvas.width / 2 - tickLength,
            y: canvas.height / 2 + label.y
        });
    } else {
        drawLine({x: canvas.width / 2 + label.x, y: canvas.height / 2 + tickLength}, {
            x: canvas.width / 2 + label.x,
            y: canvas.height / 2 - tickLength
        },);
    }
}

function drawLine(from, to) {
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
}

function drawAxisSymbols() {
    ctx.save();
    ctx.fillStyle = "black";
    ctx.fillText("X", canvas.width - 15, canvas.height / 2 - canvasCfg.shift);
    ctx.fillText("Y", canvas.width / 2 + canvasCfg.shift, 15);
    ctx.restore();
}
