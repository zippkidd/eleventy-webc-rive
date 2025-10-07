import { Rive, Fit, Layout } from '@rive-app/canvas-lite'

const animations = () => {
  const cursiveHandwritingCanvas = document.getElementById('handwritten-cursive')
  const layout = new Layout({
    fit: Fit.Contain // Changed from Fit.Layout
    // alignment: Alignment.Center // Optional: centers the animation
  })

  const riveInstance = new Rive({
    src: '/rive/yai-mini-bezier.riv',
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

  riveInstance.play('Handwriting')
}

if (document.readyState === 'LOADING') {
  document.addEventListener('DOMContentLoaded', animations)
} else {
  animations()
}
