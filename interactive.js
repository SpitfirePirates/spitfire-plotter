const Plotter = require('./src/Plotter.js')
const plotter = new Plotter()

// Readline lets us tap into the process events
const readline = require('readline')

// Allows us to listen for events from stdin
readline.emitKeypressEvents(process.stdin)

// Raw mode gets rid of standard keypress events and other
// functionality Node.js adds by default
process.stdin.setRawMode(true)

let locked = false

// Start the keypress listener for the process
process.stdin.on('keypress', (str, key) => {

    if (locked === false) {
        processkey(key)
    }

});

async function processkey(key) {
    locked = true
    // "Raw" mode so we must do our own kill switch
    if(key.name === 'escape') {
        process.exit()
    }
    if(key.sequence === '\u0003') {
        process.exit()
    }

    console.log(key)

    if(key.name === 'left') {
        await plotter.move(-100, 0)
    }
    if(key.name === 'right') {
        await plotter.move(100, 0)
    }
    if(key.name === 'up') {
        await plotter.move(0, -100)
    }
    if(key.name === 'down') {
        await plotter.move(0, 100)
    }

    locked = false
}