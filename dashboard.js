'use strict'

const fs = require('fs').promises
const https = require('https')

const Plotter = require('./src/Plotter.js')
const Writer = require('./src/Writer.js')
const Draw = require('./src/Draw.js')
const Graph = require('./src/Graph.js')
const config = require('./config')

const plotter = new Plotter()
const writer = new Writer(plotter)
const draw = new Draw(plotter)

async function run () {

    // const quoteFile = await fs.readFile(__dirname + '/storage/quotes', 'utf8')
    // const quotes = quoteFile.split('\n')
    // // Filter out long quotes
    // quotes.filter(function (quote) {
    //     return quote.length < 60
    // })
    // const quote = quotes[Math.floor(Math.random() * quotes.length)]
    const quote = 'Hello world'

    await plotter.home()

    await plotter.move(0, 500)

    writer.setFontSize(config.writer.font.sizes.small)
    await writer.write('Quote of the day:')
    await writer.carriageReturn();
    await writer.write(quote)
    await writer.carriageReturn()
    const graph = new Graph(plotter, 7400, 7600, async _ => {
        return await getBitcoinPrice()
    })
    graph.width = 6000
    graph.steps.total = 120
    graph.steps.duration = 60
    await graph.start()

    await draw.drawPreset('ubuntu')
}

run()

async function getBitcoinPrice() {
    return new Promise((resolve, reject) => {
        https.get('https://api.coindesk.com/v1/bpi/currentprice.json', resp => {
            let data = ''
            resp.on('data', chunk => {
                data += chunk
            })
            resp.on('end', _ => {
                const json = JSON.parse(data)
                resolve(json.bpi.GBP.rate_float)
            })
        })
    })
}
