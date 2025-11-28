import { Rive, RuntimeLoader, Fit, Layout } from '@rive-app/canvas-lite'

RuntimeLoader.setWasmUrl('/rive/rive.wasm')

const DEFAULT_ASPECT_RATIO = 1

const animationsList = [
  { name: 'big_pink_flower_l', aspectRatio: 130 / 205 },
  { name: 'big_pink_flower_r', aspectRatio: 85 / 131 },
  { name: 'yellow_flower_thin', aspectRatio: 48 / 86 },
  { name: 'yellow_flower_wide', aspectRatio: 68 / 87 },
  { name: 'yellow_flower_short-wide', aspectRatio: 68 / 63 },
  { name: 'small_pink_flower', aspectRatio: 30 / 40 },
  { name: 'leaves', aspectRatio: 29 / 35 },
  { name: 'you_are_invited', aspectRatio: 483 / 73 }
]

const riveInstances = new Map()
const resizeListeners = new Map()
let resizeObserver

const isCanvasVisible = (canvas) => {
  if (canvas.offsetParent === null) return false
  return window.getComputedStyle(canvas).visibility !== 'hidden'
}

const createRiveInstance = (animation) => {
  const canvas = document.getElementById(animation.name)
  if (!canvas) return null

  const layout = new Layout({
    fit: Fit.Contain
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

const updateCanvasVisibility = () => {
  animationsList.forEach((animation) => {
    const canvas = document.getElementById(animation.name)
    if (!canvas) return

    const isVisible = isCanvasVisible(canvas)
    const hasInstance = riveInstances.has(animation.name)

    if (isVisible && !hasInstance) {
      const instance = createRiveInstance(animation)
      if (instance) {
        riveInstances.set(animation.name, instance)
      }
    } else if (!isVisible && hasInstance) {
      cleanupRiveInstance(animation.name)
    }
  })
}

const init = () => {
  updateCanvasVisibility()

  resizeObserver = new window.ResizeObserver(() => {
    updateCanvasVisibility()
  })

  animationsList.forEach((animation) => {
    const canvas = document.getElementById(animation.name)
    if (canvas) {
      resizeObserver.observe(canvas)
    }
  })

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
