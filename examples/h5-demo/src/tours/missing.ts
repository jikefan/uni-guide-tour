import { defineTour } from 'uni-guide-tour'

export default defineTour('missing', {
  steps: [
    { id: 'absent', page: '/pages/home/index', target: 'never-mounted',
      title: 'Will fail', content: 'Should pause', button: 'X',
      locateRetries: 3, locateIntervalMs: 20 },
  ],
  onError: ({ error }) => {
    ;(window as any).__lastGuideError = error?.code
  },
})
