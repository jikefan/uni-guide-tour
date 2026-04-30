import type { Directive } from 'vue'

export const vGuideTarget: Directive<HTMLElement, string> = {
  mounted(el, binding) { el.dataset.guideTarget = binding.value },
  updated(el, binding) {
    if (binding.value !== binding.oldValue) el.dataset.guideTarget = binding.value
  },
  unmounted(el) { delete el.dataset.guideTarget },
}
