import SimpleWebRequestTest from './tests/SimpleWebRequestTest'
import CFPushTest from './tests/CFPushTest'

export default [
  new SimpleWebRequestTest('https://stratos.cap.explore.suse.dev/login'),
  new SimpleWebRequestTest('https://gettingstarted.cap.explore.suse.dev'),
  new SimpleWebRequestTest('https://developer.suse.com'),
  new CFPushTest()
]