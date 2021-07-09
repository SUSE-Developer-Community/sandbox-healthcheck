import CF from 'cloudfoundry-uaa-client/dist/cf'
import CfHttp from 'cloudfoundry-uaa-client/dist/http_client'
import qs from 'qs'


const uaa_uri = 'uaa.cap.explore.suse.dev'
const cf_uri = 'api.cap.explore.suse.dev'
const cf_user = 'andrew.gracey@suse.com'
const cf_pass = 'SomeTestPass'



import BasicTest from '../BasicTest.js'
export default class CFPushTest extends BasicTest{

  constructor(){
    super()
  }

  get Name () {return 'CF Push Test'}

  async run ({logger}) {
    logger.debug('CF Push Test Running')
    try{

      const http_client = new CfHttp(
      'CF',
      'https://' + cf_uri,
      {
        url: `https://${uaa_uri}/oauth/token`,
        method: 'post',
        headers: {
          Authorization: 'Basic Y2Y6',
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
        data: qs.stringify({
          grant_type: 'password',
          client_id: 'cf',
          username: cf_user,
          password: cf_pass
        })
      })
      logger.debug('CF Push Test Running2')

      await new Promise((res)=>{
        http_client.events.on('logged_in',res)
      }) 
      // Don't keep logging in same client. There might be a memory leak here, need to monitor
      clearInterval(http_client.passwordInterval)

    } catch (e){
      console.log (e)
    }
    return [{
      testName:this.Name,
      time:0, //TBD
      status: 'Success',
      payload:"Logged in",
      payloadType: 'Text'
    }]
  }
}