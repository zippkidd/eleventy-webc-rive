import { Rive, RuntimeLoader, Fit, Layout, RiveFile } from '@rive-app/canvas-lite'

RuntimeLoader.setWasmUrl('/rive/rive.wasm')

// const animationsList = [
//   { name: 'big_pink_flower_l', aspectRatio: 130 / 205 },
//   { name: 'big_pink_flower_r', aspectRatio: 85 / 131 },
//   { name: 'yellow_flower_thin', aspectRatio: 48 / 86 },
//   { name: 'yellow_flower_wide', aspectRatio: 68 / 87 },
//   { name: 'yellow_flower_short-wide', aspectRatio: 68 / 63 },
//   { name: 'small_pink_flower', aspectRatio: 30 / 40 },
//   { name: 'leaves', aspectRatio: 29 / 35 },
//   { name: 'you_are_invited', aspectRatio: 483 / 73 }
// ]

const animationsList = [
  { name: 'big_pink_flower_l' },
  { name: 'big_pink_flower_r' },
  { name: 'yellow_flower_thin' },
  { name: 'yellow_flower_wide' },
  { name: 'rotated_yellow_flower_wide' },
  { name: 'yellow_flower_short-wide' },
  { name: 'small_pink_flower' },
  { name: 'leaves' },
  { name: 'rotated_leaves' },
  { name: 'you_are_invited' }
]

const loadRiveFile = (src, onSuccess, onError) => {
  const file = new RiveFile({
    src,
    onLoad: () => onSuccess(file),
    onLoadError: onError
  })
  file.init().catch(onError)
}

const loadAllRiveFiles = async () => {
  const loadingPromises = animationsList.map((animation) => {
    return new Promise((resolve, reject) => {
      loadRiveFile(
        `/rive/${animation.name}.riv`,
        (file) => {
          animation.riveFile = file
          resolve()
        },
        (error) => {
          console.error(`Failed to load Rive file ${animation.name}:`, error)
          reject(error)
        }
      )
    })
  })
  return Promise.all(loadingPromises)
}

const canvasToInstance = new Map()
const canvasToResizeListener = new Map()
let resizeObserver

const isCanvasVisible = (canvas) => {
  if (canvas.offsetParent === null) return false
  return window.getComputedStyle(canvas).visibility !== 'hidden'
}

const createRiveInstance = (canvas, animation) => {
  if (!canvas || !animation.riveFile) return null

  const layout = new Layout({
    fit: Fit.Contain
  })

  const riveInstance = new Rive({
    riveFile: animation.riveFile,
    canvas,
    layout,
    autoplay: true,
    onLoad: () => {
      setCanvasSize()
    }
  })

  const setCanvasSize = () => {
    if (riveInstance) {
      // console.log(`Resizing canvas for ${animation.name}`)
      riveInstance.resizeDrawingSurfaceToCanvas()
    }
  }

  const resizeHandler = () => {
    setCanvasSize()
  }

  setCanvasSize()
  window.addEventListener('resize', resizeHandler, false)
  canvasToResizeListener.set(canvas, resizeHandler)
  riveInstance.play()

  return riveInstance
}

const cleanupRiveInstance = (canvas) => {
  const instance = canvasToInstance.get(canvas)
  if (instance) {
    instance.stop()
    instance.dispose?.()
    canvasToInstance.delete(canvas)
  }

  const resizeHandler = canvasToResizeListener.get(canvas)
  if (resizeHandler) {
    window.removeEventListener('resize', resizeHandler, false)
    canvasToResizeListener.delete(canvas)
  }
}

const updateCanvasVisibility = () => {
  animationsList.forEach((animation) => {
    const canvases = document.querySelectorAll(`canvas[id^="${animation.name}"]`)
    if (!canvases || canvases.length === 0) return

    canvases.forEach((canvas) => {
      const isVisible = isCanvasVisible(canvas)
      const hasInstance = canvasToInstance.has(canvas)

      if (isVisible && !hasInstance) {
        const instance = createRiveInstance(canvas, animation)
        if (instance) {
          canvasToInstance.set(canvas, instance)
        }
      } else if (!isVisible && hasInstance) {
        cleanupRiveInstance(canvas)
      }
    })
  })
}

const init = async () => {
  try {
    await loadAllRiveFiles()
  } catch (error) {
    console.error('Error loading Rive files:', error)
  }

  console.table(animationsList)

  updateCanvasVisibility()

  resizeObserver = new window.ResizeObserver(() => {
    updateCanvasVisibility()
  })

  animationsList.forEach((animation) => {
    const canvases = document.querySelectorAll(`canvas[id^="${animation.name}"]`)
    canvases.forEach((canvas) => {
      resizeObserver.observe(canvas)
    })
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
