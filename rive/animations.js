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

const init = () => {
  animationsList.forEach((animation) => {
    const canvas = document.getElementById(animation.name)
    if (!canvas) return

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

    setCanvasSize()
    window.addEventListener('resize', setCanvasSize, false)
    riveInstance.play()
  })
}

if (document.readyState === 'LOADING') {
  document.addEventListener('DOMContentLoaded', init)
} else {
  init()
}
