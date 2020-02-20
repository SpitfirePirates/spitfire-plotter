'use strict'

const Plotter = require('./src/Plotter.js')
const Writer = require('./src/Writer.js')
const Draw = require('./src/Draw.js')
const Graph = require('./src/Graph.js')
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

    // writer.setFontSize(config.writer.font.sizes.small)
    // await writer.write('Quote of the day:')
    // await writer.carriageReturn();
    // await writer.write(quote)
    // await writer.carriageReturn()
    const graph = new Graph(plotter, 2000)
    await graph.start()

    plotter.release()
}

run()
