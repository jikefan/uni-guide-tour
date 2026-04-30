import { defineTour } from 'uni-guide-tour'

export default defineTour('delayed', {
  steps: [
    { id: 'home-card', page: '/pages/home/index', target: 'card-1',
      title: 'Home', content: 'Click next', button: 'Next' },
    { id: 'p2-delayed', page: '/pages/page2/index?delay=600', target: 'card-3',
      title: 'Delayed page', content: 'Should appear after 600ms wait', button: 'Done',
      locateRetries: 30, locateIntervalMs: 50 },
  ],
})
