import { defineTour } from 'uni-guide-tour'

export default defineTour('demo', {
  allowSkip: false, allowBack: false, resumeStrategy: 'continue',
  progressFormat: '{current}/{total}',
  steps: [
    { id: 'p1-card1', page: '/pages/home/index', target: 'card-1',
      title: 'Step 1', content: 'First card on home page', button: 'Next' },
    { id: 'p1-card2', page: '/pages/home/index', target: 'card-2',
      title: 'Step 2', content: 'Second card on home page', button: 'Next' },
    { id: 'p2-card', page: '/pages/page2/index', target: 'card-3',
      title: 'Step 3', content: 'Cross-page jump worked!', button: 'Next' },
    { id: 'p3-card', page: '/pages/page3/index', target: 'card-4',
      title: 'Step 4', content: 'Another page', button: 'Next' },
    { id: 'p3-end', page: '/pages/page3/index', target: 'card-5',
      title: 'Step 5', content: 'Last step!', button: 'Done' },
  ],
})
