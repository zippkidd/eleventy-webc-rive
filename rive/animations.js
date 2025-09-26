import { Rive, Fit, Layout } from '@rive-app/canvas-lite'

const animations = () => {
  const layout = new Layout({
    fit: Fit.Layout,
    layoutScaleFactor: 1
  })

  const cursiveHandwritingCanvas = document.getElementById('handwritten-cursive')

  window.addEventListener('resize', () => {
    riveInstance.resizeDrawingSurfaceToCanvas()
  }, false)

  const cleanupRive = () => {
    riveInstance.cleanup()
  }

  const riveInstance = new Rive({
    src: '/rive/yai-mini-bezier.riv',
    canvas: cursiveHandwritingCanvas,
    layout,
    autoplay: true,
    onLoad: () => {
      riveInstance.resizeDrawingSurfaceToCanvas()
    }
  })

  riveInstance.play('Handwriting')
}

if (document.readyState === 'LOADING') {
  document.addEventListener('DOMContentLoaded', animations)
} else {
  animations()
}
