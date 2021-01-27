//Params
const drawColor = "#13476D"
const snapGridSpacing = 25
const minMsBetweenDraws = 1
const drawStartDelay = 2000
const drawVisibleDuration = 300

//Setup drawing
const backgroundColor = window.getComputedStyle(document.body, null).getPropertyValue('background-color')
const canvas = document.getElementById("can")
const context = canvas.getContext('2d')
var nextAllowedDrawTime = 0
var mousePosition = { x: -1, y: -1 }
resizeCanvas()
window.addEventListener('resize', resizeCanvas)
document.addEventListener('mousemove', onMouseMove)
document.addEventListener('mousedown', setPosition)

//Draw background
context.fillStyle = backgroundColor
context.fillRect(0, 0, canvas.width, canvas.height)

function resizeCanvas() {
    context.canvas.width = window.innerWidth
    context.canvas.height = window.innerHeight
}

function onMouseMove(e) {
    var prevX = mousePosition.x
    var prevY = mousePosition.y
    setPosition(e)
    var currX = mousePosition.x
    var currY = mousePosition.y

    if (prevX > -1 && prevY > -1) {
        var startDelayMs = 0
        var now = Date.now()
        if (nextAllowedDrawTime > now + startDelayMs) {
            startDelayMs += (nextAllowedDrawTime - now)
        }

        setTimeout(function() { drawPath(prevX, prevY, currX, currY, 0) }, startDelayMs + drawStartDelay)
        setTimeout(function() { drawPath(prevX, prevY, currX, currY, 1) }, startDelayMs + drawStartDelay + drawVisibleDuration)
        nextAllowedDrawTime = now + startDelayMs + minMsBetweenDraws
    }
}

function setPosition(e) {
    mousePosition.x = quickRound(e.clientX / snapGridSpacing) * snapGridSpacing
    mousePosition.y = quickRound(e.clientY / snapGridSpacing) * snapGridSpacing
}

function quickRound(x) { //Faster than Math.round()
    return x + 0.5 | 0
}

function drawPath(x0, y0, x1, y1, erase) {
    var dx = x0 - x1
    var dy = y0 - y1
    if (dx !== 0 || dy !== 0) {
        if (erase) {
            context.lineWidth = 15
            context.strokeStyle = backgroundColor
        } else {
            context.lineWidth = 10
            context.strokeStyle = drawColor
        }
        context.lineCap = 'round'
        context.beginPath()
        context.moveTo(x0, y0)
        context.lineTo(x1, y1)
        context.stroke()
    }
}