'use strict'

const Plotter = require('./src/Plotter.js')
const Writer = require('./src/Writer.js')
const fs = require('fs').promises

const plotter = new Plotter()

async function run () {

    const quoteFile = await fs.readFile(__dirname + '/storage/quotes', 'utf8')
    const quotes = quoteFile.split('\n')
    await Writer.write(quotes[Math.floor(Math.random() * quotes.length)])

    await plotter.home()
    plotter.release()
}

run()
