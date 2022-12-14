import { runArtificialLife, ArtificialLifeConfig } from './artificial-life'

const rootEl = document.getElementById('root')!

const YELLOW_ID = 'yellow'
const RED_ID = 'red'
const GREEN_ID = 'green'
const MAGENTA_ID = 'magenta'

const arCfg: ArtificialLifeConfig = {
  particleInteractionDistancePx: 120,
  particleSizePx: 1,
  velocityMultiplier: 0.5,
  canvasSize: {
    width: 500,
    height: 500,
  },
  particleGroups: [
    {
      id: YELLOW_ID,
      color: 'yellow',
      amount: 500,
      affectedBy: [
        { particleGroupId: RED_ID, gravity: 0.15 },
        { particleGroupId: GREEN_ID, gravity: 0.15 },
        { particleGroupId: YELLOW_ID, gravity: 0.15 },
      ],
    },
    {
      id: RED_ID,
      color: 'red',
      amount: 500,
      affectedBy: [
        { particleGroupId: RED_ID, gravity: 0.1 },
        { particleGroupId: GREEN_ID, gravity: -0.1 },
      ],
    },
    {
      id: GREEN_ID,
      color: 'green',
      amount: 500,
      affectedBy: [
        { particleGroupId: YELLOW_ID, gravity: 0.2 },
        { particleGroupId: GREEN_ID, gravity: -0.7 },
        { particleGroupId: RED_ID, gravity: -0.2 },
      ],
    },
    {
      id: MAGENTA_ID,
      color: 'magenta',
      amount: 2000,
      affectedBy: [
        { particleGroupId: MAGENTA_ID, gravity: 0.4 },
        { particleGroupId: GREEN_ID, gravity: -0.3 },
        { particleGroupId: RED_ID, gravity: 0.2 },
        { particleGroupId: YELLOW_ID, gravity: 1.1 },
      ],
    },
  ],
}

runArtificialLife(arCfg, rootEl)
