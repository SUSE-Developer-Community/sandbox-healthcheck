export const BreakOnceOnException = false
export const BreakForeverOnException = false
export const Name = 'Sample Test'

const run = async ({logger}) => {
  logger.debug('Sample Test Running')
}

export default {
  Name: 'Sample Test',
  run,
  BreakOnceOnException: false,
  BreakForeverOnException: false
}