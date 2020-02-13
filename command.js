const Plotter = require('./src/Plotter.js')
const program = require('commander')
const Writer = require('./src/Writer')

const plotter = new Plotter()

program
    .version('0.1.0')
    .option('up [amount]', 'Move the plotter up', 100)
    .option('down [amount]', 'Move the plotter down', 100)
    .option('left [amount]', 'Move the plotter left', 100)
    .option('right [amount]', 'Move the plotter right', 100)
    .option('home', 'Move the plotter home')
    .option('write [text]', 'Write some text')
    .parse(process.argv)

run()

async function run()
{
    if (program.up) {
        console.log(`Moving up by ${program.up}`)
        await plotter.move(0, program.up * -1)
    }
    if (program.down) {
        console.log(`Moving down by ${program.down}`)
        await plotter.move(0, program.down)
    }
    if (program.left) {
        console.log(`Moving left by ${program.left}`)
        await plotter.move(program.left * -1, 0)
    }
    if (program.right) {
        console.log(`Moving right by ${program.right}`)
        await plotter.move(program.right, 0)
    }
    if (program.home) {
        console.log('Going home')
        await plotter.home()
    }
    if (program.write) {
        console.log(`Writing '${program.write}'`)
        await Writer.write(program.write)
    }

    process.exit();
}
