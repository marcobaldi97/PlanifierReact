export const QUANTUM = 500;

export enum PCBState {
  READY = 'ready',
  EXECUTING = 'executing',
  DONE = 'done'
}

type QueuesSetter = (newQueues: Queues) => void;

export class PCB {
  public id: number;
  public priority: number;
  public state: PCBState;
  public duration: number;

  constructor(
    queues: Queues,
    setQueues: QueuesSetter,
    quantum: number,
    queueNumber: number,
    priority = 0,
    duration?: number
  ) {
    this.id = Math.floor(Math.random() * 100000);
    this.priority = priority;
    this.state = PCBState.READY;
    this.duration = duration ?? Math.floor(Math.random() * 1200);

    queues[queueNumber] = [...queues[queueNumber], this];

    setQueues([...queues]);
    planifierRR(queues, setQueues, quantum);
  }

  public execute(queues: Queues, setQueues: QueuesSetter, quantum: number) {
    const toExecute = this.duration <= quantum ? this.duration : quantum;
    this.duration = this.duration - toExecute;

    this.state = PCBState.EXECUTING;
    return new Promise((resolve) => setTimeout(resolve, toExecute)).then(() => {
      if (this.duration === 0) {
        this.state = PCBState.DONE;

        setQueues([...queues]);

        planifierRR(queues, setQueues, quantum);
      } else {
        this.state = PCBState.READY;

        setQueues([...queues]);
      }
    });
  }
}

export const dispatcher = async (
  process: PCB,
  queues: Queues,
  setQueues: QueuesSetter,
  quantum: number
) => {
  await process.execute(queues, setQueues, quantum);
};

export type Queue = PCB[];
export type Queues = Queue[];

export const planifierRR = async (
  queues: Queues,
  setQueues: QueuesSetter,
  quantum: number
) => {
  for (let i = 0; i < queues.length; i++) {
    const queue = queues[i];

    if (queue.length == 0) continue;

    const valids = queue.filter((proceso) => proceso.state !== PCBState.DONE);

    setQueues([...queues]);

    if (valids.length > 0) {
      await dispatcher(
        valids.sort((v1, v2) => v1.priority - v2.priority)[0],
        queues,
        setQueues,
        quantum
      );
      break;
    }
  }
};

const MAX_PRIORITY = 10;

export function processCreator(
  queues: Queues,
  setQueues: QueuesSetter,
  maxPerQueue: number,
  quantum: number
) {
  const priority = Math.floor(Math.random() * 100) % MAX_PRIORITY;
  const queueNumber = Math.floor(Math.random() * 100) % queues.length;

  if (queues[queueNumber].length >= maxPerQueue)
    planifierRR(queues, setQueues, quantum);
  else new PCB(queues, setQueues, quantum, queueNumber, priority);
}
