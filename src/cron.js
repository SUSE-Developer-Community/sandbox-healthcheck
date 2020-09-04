import tests from './tests.js'
import cron from 'node-cron'
import winston from  'winston'
import express from 'express'

winston.level = process.env.LOG_LEVEL || 'debug'
winston.add(new winston.transports.Console({
  format: winston.format.simple(),
  handleExceptions: true
}))

winston.debug('Cron starting')



const testRuns = []

const SCHEDULE = process.env.CRON || '* * * * *'

// MUTEX so things don't overrun on timing
let running = false

cron.schedule(SCHEDULE, async function() {
  if (running) {
    //TODO: If we run as long running cron job, 
    //      should have both a webpage to show data 
    //      and a time series database to push all results to!
    winston.warn('Previous Tests still running!')
    return
  }

  try {
    //TODO instrument this with OpenTelemetry
    running = true
    await runAllTests()
    running = false
  } catch (e) {
    winston.error(e)
  }
})

const runAllTests = async () => {

  let testOutputs = []

  for (let i = 0; i<tests.length; i++) {
    try {
      let test = tests[i]
      winston.warn(`About to Run: ${test.Name}`)
      
      const res = await test.run({logger: winston})
      testOutputs = testOutputs.concat(res)
      winston.warn(`Finished: ${test.Name}`)

    } catch (e){
      winston.warn(`Error from: ${test.Name}`)
      winston.error(e)

      if(test.breakOnceOnException) {
        if (!test.breakForeverOnException){
          winston.warn('Ending Tests!')
          running = false
        }
        throw ('Stopping Test Run!')
      }
    }
  }
  console.log(testRuns.length)
  console.log(testOutputs.length)
  testRuns.push(JSON.parse(JSON.stringify(testOutputs)))
}
runAllTests()
// This is terrible code... Ignore until can be rewritten
const buildTableForRun = (run)=>(`
  <table>
    ${run.reduce((acc,curr)=>(`${acc}
    <tr>
      <td>${curr.testName}<td>
      <td>${curr.time}<td>
      <td>${curr.status}<td>
      <td><a href='data:image/png;base64,${curr.payload}' >Img</a><td>
    </tr>`),'')}
  </table>
`)


const app = express()
app.get('/', async (req, res) => {

  console.log(testRuns)

  const testListHtml = testRuns.map(buildTableForRun)
    .reduce((acc,curr)=>(`${acc}<li>${curr}</li>`),'')


  res.send(`<html>
    <head><title>Status</title></head>
    <body>
      <ul>
        ${testListHtml}
      </ul>
    </body>
  </html>`)
})

app.listen(8080, () => winston.info('App listening'))