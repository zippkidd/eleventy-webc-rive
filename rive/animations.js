import { Rive, RuntimeLoader, Fit, Layout } from '@rive-app/canvas-lite'

RuntimeLoader.setWasmUrl('/rive/rive.wasm')

// Each animation now includes a `name` and an `aspectRatio` (width / height).
// Adjust the aspectRatio values as needed per animation.
const DEFAULT_ASPECT_RATIO = 4 / 3 // fallback width / height

const animationsList = [
  { name: 'big_pink_flower_l', aspectRatio: 130 / 205 },
  { name: 'big_pink_flower_r', aspectRatio: DEFAULT_ASPECT_RATIO },
  { name: 'yellow_flower_thin', aspectRatio: DEFAULT_ASPECT_RATIO },
  { name: 'yellow_flower_wide', aspectRatio: DEFAULT_ASPECT_RATIO },
  { name: 'yellow_flower_short-wide', aspectRatio: DEFAULT_ASPECT_RATIO },
  { name: 'small_pink_flower', aspectRatio: DEFAULT_ASPECT_RATIO },
  { name: 'leaves', aspectRatio: DEFAULT_ASPECT_RATIO },
  { name: 'you_are_invited', aspectRatio: DEFAULT_ASPECT_RATIO }
]

// Store Rive instances and state
const riveInstances = new Map()
const resizeListeners = new Map()
let resizeObserver

/**
 * Check if a canvas element is visible (not hidden by display: none or similar)
 */
const isCanvasVisible = (canvas) => {
  // offsetParent is null if display:none or visibility:hidden
  if (canvas.offsetParent === null) return false

  // Additional check for visibility: hidden (offsetParent doesn't catch this)
  return window.getComputedStyle(canvas).visibility !== 'hidden'
}

/**
 * Create a Rive instance for a given animation
 */
const createRiveInstance = (animation) => {
  const canvas = document.getElementById(animation.name)
  if (!canvas) return null

  const layout = new Layout({
    fit: Fit.Contain
    // alignment: Alignment.Center // Optional: centers the animation
  })

  const riveInstance = new Rive({
    src: `/rive/${animation.name}.riv`,
    canvas,
    layout,
    autoplay: true,
    onLoad: () => {
      setCanvasSize()
    }
  })

  // Set canvas dimensions to maintain aspect ratio
  const setCanvasSize = () => {
    const containerWidth = window.innerWidth * 0.65
    canvas.width = containerWidth
    canvas.height = containerWidth / (animation.aspectRatio || DEFAULT_ASPECT_RATIO)
    if (riveInstance) {
      riveInstance.resizeDrawingSurfaceToCanvas()
    }
  }

  const resizeHandler = () => {
    setCanvasSize()
  }

  setCanvasSize()
  window.addEventListener('resize', resizeHandler, false)
  resizeListeners.set(animation.name, resizeHandler)
  riveInstance.play()

  return riveInstance
}

/**
 * Clean up a Rive instance
 */
const cleanupRiveInstance = (animationName) => {
  const instance = riveInstances.get(animationName)
  if (instance) {
    instance.stop()
    instance.dispose?.()
    riveInstances.delete(animationName)
  }

  const resizeHandler = resizeListeners.get(animationName)
  if (resizeHandler) {
    window.removeEventListener('resize', resizeHandler, false)
    resizeListeners.delete(animationName)
  }
}

/**
 * Check visibility of all canvases and create/cleanup instances accordingly
 */
const updateCanvasVisibility = () => {
  animationsList.forEach((animation) => {
    const canvas = document.getElementById(animation.name)
    if (!canvas) return

    const isVisible = isCanvasVisible(canvas)
    const hasInstance = riveInstances.has(animation.name)

    if (isVisible && !hasInstance) {
      // Canvas is now visible, create instance
      const instance = createRiveInstance(animation)
      if (instance) {
        riveInstances.set(animation.name, instance)
      }
    } else if (!isVisible && hasInstance) {
      // Canvas is now hidden, cleanup instance
      cleanupRiveInstance(animation.name)
    }
  })
}

const init = () => {
  // Initialize all visible canvases
  updateCanvasVisibility()

  // Set up ResizeObserver to track changes to canvas visibility
  resizeObserver = new window.ResizeObserver(() => {
    updateCanvasVisibility()
  })

  // Observe all canvas elements for visibility changes
  animationsList.forEach((animation) => {
    const canvas = document.getElementById(animation.name)
    if (canvas) {
      resizeObserver.observe(canvas)
    }
  })

  // Also handle window resize events for visibility updates
  let resizeTimeout
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout)
    resizeTimeout = setTimeout(updateCanvasVisibility, 250)
  }, false)
}

if (document.readyState === 'LOADING') {
  document.addEventListener('DOMContentLoaded', init)
} else {
  init()
}
