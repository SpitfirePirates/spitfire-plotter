const Plotter = require('./src/Plotter.js')
const plotter = new Plotter()

plotter.home()
    .then(_ => {process.exit()})
    .catch(e => {
        console.error(e);
        process.exit();
    });;
