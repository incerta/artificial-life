import { Particle } from './artificial-life'

export default class Canvas {
  element: HTMLCanvasElement
  private canvasContext: CanvasRenderingContext2D

  constructor(p: { width: number; height: number }) {
    this.element = document.createElement('canvas')

    this.element.setAttribute('width', p.width.toString())
    this.element.setAttribute('height', p.height.toString())

    const canvasContext = this.element.getContext('2d')

    if (canvasContext === null) {
      throw Error('Could not get canvasContext')
    }

    this.canvasContext = canvasContext
  }

  draw(x: number, y: number, color: string, sizePx: number) {
    this.canvasContext.fillStyle = color
    this.canvasContext.fillRect(x, y, sizePx, sizePx)
  }

  drawParticle(particle: Particle, particleSizePx: number) {
    this.draw(particle.x, particle.y, particle.color, particleSizePx)
  }

  clear() {
    const width = this.element.width
    const height = this.element.height

    this.canvasContext.clearRect(0, 0, width, height)
  }
}
