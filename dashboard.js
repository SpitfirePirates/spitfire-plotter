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

    const quoteFile = await fs.readFile(__dirname + '/storage/quotes', 'utf8')
    const quotes = quoteFile.split('\n')
    const quote = quotes[Math.floor(Math.random() * quotes.length)]

    await plotter.home()

    writer.setFontSize(config.writer.font.sizes.small)
    await writer.write('Quote of the day:')
    await writer.carriageReturn();
    await writer.write(quote)
    await writer.carriageReturn()
    const graph = new Graph(plotter, 7450, 7500, async _ => {
        return await getBitcoinPrice()
    })
    graph.steps.total = 40
    graph.steps.duration = 300
    await graph.start()

    plotter.release()
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
