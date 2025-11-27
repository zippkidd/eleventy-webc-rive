import { Rive, RuntimeLoader, Fit, Layout } from '@rive-app/canvas-lite'


RuntimeLoader.setWasmUrl('/rive/rive.wasm')

const animationsList = [
  'big_pink_flower_l',
  'big_pink_flower_r',
  'yellow_flower_thin',
  'yellow_flower_wide',
  'yellow_flower_short-wide',
  'small_pink_flower',
  'leaves',
  'you_are_invited'
]

const aspectRatio = 475 / 67 // width / height from your animation

const init = () => {
  animationsList.forEach((animationName) => {
    const canvas = document.getElementById(animationName)
    if (!canvas) return

    const layout = new Layout({
      fit: Fit.Contain
      // alignment: Alignment.Center // Optional: centers the animation
    })

    const riveInstance = new Rive({
      src: `/rive/${animationName}.riv`,
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
      canvas.height = containerWidth / aspectRatio
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
