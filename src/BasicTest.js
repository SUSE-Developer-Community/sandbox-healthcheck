
export default class BasicTest {

  get Name () {
    console.error('Test Name not defined!') //not in Winston due to no 
    return 'Name Not Set'
  }
  get BreakOnceOnException () {return false}
  get BreakForeverOnException () {return false}

  async run ({logger}) {
    logger.error('Test Run not defined!')
  }
}