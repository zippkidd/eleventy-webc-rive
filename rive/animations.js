import { Rive, RuntimeLoader, Fit, Layout } from '@rive-app/canvas-lite'

RuntimeLoader.setWasmUrl('/rive/rive.wasm')

const animationsList =
[
  'big_pink_flower_l',
  'big_pink_flower_r',
  'yellow_flower_thin',
  'yellow_flower_wide',
  'yellow_flower_short-wide',
  'small_pink_flower',
  'leaves',
  'you_are_invited'
]

const init = () => {
  const cursiveHandwritingCanvas = document.getElementById('handwritten-cursive')
  const layout = new Layout({
    fit: Fit.Contain // Changed from Fit.Layout
    // alignment: Alignment.Center // Optional: centers the animation
  })

  const riveInstance = new Rive({
    src: '/rive/flowers_animating_prod-1.0.1.riv',
    canvas: cursiveHandwritingCanvas,
    layout,
    autoplay: true,
    onLoad: () => {
      setCanvasSize()
    }
  })

  // Set canvas dimensions to maintain aspect ratio
  const setCanvasSize = () => {
    console.log('setCanvasSize..2')
    const containerWidth = window.innerWidth * 0.65 // 80% of viewport width
    const aspectRatio = 475 / 67 // width / height from your animation

    cursiveHandwritingCanvas.width = containerWidth
    cursiveHandwritingCanvas.height = containerWidth / aspectRatio

    if (riveInstance) {
      riveInstance.resizeDrawingSurfaceToCanvas()
    }
  }

  setCanvasSize()

  window.addEventListener('resize', setCanvasSize, false)

  // riveInstance.play('You-Are-Invited')
  riveInstance.play()
  // riveInstance.pause()
}

if (document.readyState === 'LOADING') {
  document.addEventListener('DOMContentLoaded', init)
} else {
  init()
}
