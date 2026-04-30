import { defineTour } from 'uni-guide-tour'

export default defineTour('scroll', {
  steps: [
    { id: 'b', page: '/pages/home/index', target: 'card-bottom',
      title: 'Auto-scrolled', content: 'Should be in view', button: 'OK' },
  ],
})
