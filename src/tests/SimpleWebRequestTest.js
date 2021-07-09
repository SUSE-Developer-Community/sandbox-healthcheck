import BasicTest from '../BasicTest.js'

import axios from 'axios'
import html2image from 'node-html-to-image'

export default class SimpleWebRequestTest extends BasicTest{

  constructor(url, method){
    super()
    this._url = url
    this._method = method || 'get'
    console.log(`Setting up BasicWebRequest for ${this._url}`)
  }

  get Name () {return `BasicWebRequest for ${this._url}`}

  async run ({logger}) {

    try {
      //winston.debug(`Running BasicWebRequest ${this._method} request for ${this._url}`)
      const ret = await axios({method: this._method, url: this._url})

      //winston.debug(`Success: ${this._method} request for ${this._url}`)

      let payload = 'Image Not Available'
      let payloadType = 'String'
      try {
        payload = await html2image({
          html:ret.data,
          encoding:'base64',
          waitUntil:'load'
        })
        if(payload) payloadType = 'img'
      } catch(e) {
        console.error(e)
      }

      return [{
        testName:this.Name,
        time:0, //TBD
        status: 'Success',
        payload,
        payloadType
      }]

    } catch (e) {
      console.log(`Failed: ${this._method} request for ${this._url}`)
      console.error(e)
      return [{
        testName:this.Name,
        time:0, //TBD
        status: 'Failed',
        payload:e,
        payloadType: 'Error'
      }]
    }


  }
}