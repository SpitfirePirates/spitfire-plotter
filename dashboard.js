'use strict'

const Plotter = require('./src/Plotter.js')
const Writer = require('./src/Writer.js')
const Draw = require('./src/Draw.js')
const fs = require('fs').promises
const config = require('./config')

const plotter = new Plotter()
const writer = new Writer(plotter)
const draw = new Draw(plotter)

async function run () {

    const quoteFile = await fs.readFile(__dirname + '/storage/quotes', 'utf8')
    const quotes = quoteFile.split('\n')
    const quote = quotes[Math.floor(Math.random() * quotes.length)]

    await plotter.home()

    await plotter.move(0, 250)
    writer.setFontSize(config.writer.font.sizes.small)
    await writer.write('Quote of the day:')
    await writer.carriageReturn();
    await writer.write(quote)
    await writer.carriageReturn()
    await draw.drawPreset('ubuntu')

    plotter.release()
}

run()
