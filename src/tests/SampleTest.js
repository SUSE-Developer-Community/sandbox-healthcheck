import BasicTest from '../BasicTest.js'
export default class SampleTest extends BasicTest{

  constructor(){
    super()
  }

  get Name () {return 'SampleTest'}

  async run ({logger}) {
    logger.debug('Sample Test Running')
  }
}