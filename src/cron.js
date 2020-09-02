import tests from './tests.js'
import cron from 'node-cron'
import winston from  'winston'

winston.level = process.env.LOG_LEVEL || 'debug'
winston.add(new winston.transports.Console({
  format: winston.format.simple(),
  handleExceptions: true
}))

winston.debug('Cron starting')

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
    
    tests.forEach(async test => {
      try {
        winston.warn(`About to Run: ${test.Name}`)
        
        await test.run({logger: winston, parentSpan: null, })
        winston.warn(`Finished: ${test.Name}`)

      } catch (e){
        winston.warn(`Error from: ${test.Name}`)
        winston.error(e)

        if(test.breakOnceOnException) {
          if (!test.breakForeverOnException){
            running = false
          }
          throw ('Stopping Tests!')
        }
      }
    })
    
    running = false
  } catch (e) {
    winston.error(e)
  }

})