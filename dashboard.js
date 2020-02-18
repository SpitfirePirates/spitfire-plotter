'use strict'

const Plotter = require('./src/Plotter.js')
const Writer = require('./src/Writer.js')
const fs = require('fs').promises

const plotter = new Plotter()
const writer = new Writer(plotter)

async function run () {

    const quoteFile = await fs.readFile(__dirname + '/storage/quotes', 'utf8')
    const quotes = quoteFile.split('\n')
    const quote = quotes[Math.floor(Math.random() * quotes.length)]
    await writer.write(quote, 300)

    await plotter.home()
    plotter.release()
}

run()
