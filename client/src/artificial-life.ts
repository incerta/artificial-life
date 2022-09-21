import Canvas from './canvas-component'

type ParticleGroup = {
  id: string

  /* Amount of particles generated */
  amount: number

  /* Color of each particle */
  color: string

  /* How this group affected by other particles */
  affectedBy: Array<{
    particleGroupId: string

    /* Interaction magnitude: negative values is attraction and positive repultion */
    gravity: number
  }>
}

export type ArtificialLifeConfig = {
  particleInteractionDistancePx: number
  particleSizePx: number

  /* Multiply velocity by provided value on each render cycle */
  velocityMultiplier: number

  canvasSize: {
    width: number
    height: number
  }

  particleGroups: ParticleGroup[]
}

export type Particle = {
  x: number
  y: number

  /* velocity X */
  vx: number

  /* velocity Y */
  vy: number
  color: string
}

type ArtificialLifeOutput = {
  config: ArtificialLifeConfig
  particles: Particle[]
  renderNext: () => Particle[]
}

export function artificialLifeStateMachine(cfg: ArtificialLifeConfig): ArtificialLifeOutput {
  const particleGroups: Map<string /* particleGroupId */, ParticleGroup & { particles: Particle[] }> = new Map()

  cfg.particleGroups.forEach((particleGroup) => {
    particleGroups.set(particleGroup.id, {
      ...particleGroup,
      particles: generateParticles({
        canvasSize: cfg.canvasSize,
        amount: particleGroup.amount,
        color: particleGroup.color,
      }),
    })
  })

  const applyPhysics = (particles: Particle[], affectedBy: Particle[], gravity: number) => {
    for (const a of particles) {
      let forceX = 0
      let forceY = 0

      for (const b of affectedBy) {
        if (a === b) continue

        const distanceX = a.x - b.x
        const distanceY = a.y - b.y

        const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2)

        if (distance > 0 && distance < cfg.particleInteractionDistancePx) {
          const force = gravity * (1 / distance)

          forceX += force * distanceX
          forceY += force * distanceY
        }
      }

      a.vx = (a.vx + forceX) * cfg.velocityMultiplier
      a.vy = (a.vy + forceY) * cfg.velocityMultiplier

      a.x += a.vx
      a.y += a.vy

      if (a.x <= 0 || a.x >= cfg.canvasSize.width) a.vx *= -1
      if (a.y <= 0 || a.y >= cfg.canvasSize.height) a.vy *= -1
    }
  }

  const particles = ((): Particle[] => {
    const result: Particle[] = []
    particleGroups.forEach((group) => group.particles.forEach((particle) => result.push(particle)))
    return result
  })()

  return {
    config: cfg,
    particles: particles,
    renderNext: () => {
      particleGroups.forEach((group) => {
        for (const affectedBy of group.affectedBy) {
          const affectedByParticles = particleGroups.get(affectedBy.particleGroupId)

          if (affectedByParticles === undefined) {
            throw Error(`Non consistent config, can not found group with id: ${affectedBy.particleGroupId}`)
          }

          applyPhysics(group.particles, affectedByParticles.particles, affectedBy.gravity)
        }
      })

      return particles
    },
  }
}

function generateParticles(options: {
  paddingPx?: number
  canvasSize: {
    width: number
    height: number
  }
  amount: number
  color: string
}): Particle[] {
  const particles: Particle[] = []
  const paddingPx = options.paddingPx || 0

  const makeParticle = (x: number, y: number, color: string): Particle => ({
    x,
    y,
    color,
    vx: 0,
    vy: 0,
  })

  for (let i = 0; i < options.amount; i++) {
    particles.push(
      makeParticle(
        random(paddingPx, options.canvasSize.width),
        random(paddingPx, options.canvasSize.height),
        options.color
      )
    )
  }

  return particles
}

function random(min: number, max: number) {
  return Math.random() * (max - min) + min
}

export function checkLifeResult(p: { config: ArtificialLifeConfig; rootEl: HTMLElement; interactionsAmount: number }) {
  const life = artificialLifeStateMachine(p.config)

  for (let i = 0; i < p.interactionsAmount; i++) {
    life.renderNext()
  }

  const canvas = new Canvas(p.config.canvasSize)

  p.rootEl.append(canvas.element)

  life.particles.forEach((particle) => canvas.drawParticle(particle, life.config.particleSizePx))
}

export function runArtificialLife(config: ArtificialLifeConfig, rootEl: HTMLElement): void {
  const life = artificialLifeStateMachine(config)
  const canvas = new Canvas(config.canvasSize)

  rootEl.append(canvas.element)

  const renderParticles = () => {
    canvas.clear()

    life.renderNext()
    life.particles.forEach((particle) => canvas.drawParticle(particle, life.config.particleSizePx))

    window.requestAnimationFrame(renderParticles)
  }

  renderParticles()
}
