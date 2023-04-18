import { useCallback, useEffect, useState, useMemo } from 'react';

enum PCBState {
  READY = 'ready',
  EXECUTING = 'executing',
  DONE = 'done'
}

interface PCB_PROPS {
  id: number;
  priority: number;
  state: PCBState;
  duration: number;
}

const MAX_PRIORITY = 10;

export type Queue = PCB_PROPS[];

export type Queues = Queue[];

interface UseScheduelerProps {
  quantum: number;
  creationInterval: number;
  maxPerQueue: number;
  queuesAmount: number;
  isRunning: boolean;
}

interface ScheduelerResult {
  queues: Queues;
  cleanupDoneProcesses: () => void;
}

export default function useSchedueler({
  creationInterval,
  isRunning,
  maxPerQueue,
  quantum,
  queuesAmount
}: UseScheduelerProps): ScheduelerResult {
  const [queues, setQueues] = useState<Queues>(new Array<Queue>(3).fill([]));
  const [started, setStarted] = useState(false);

  // #region PCB stuff

  class PCB implements PCB_PROPS {
    public id: number;
    public priority: number;
    public state: PCBState;
    public duration: number;

    constructor(queueNumber: number, priority = 0, duration?: number) {
      this.id = Math.floor(Math.random() * 100000);
      this.priority = priority;
      this.state = PCBState.READY;
      this.duration = duration ?? Math.floor(Math.random() * 1200);

      queues[queueNumber] = [...queues[queueNumber], this];

      setQueues([...queues]);
      planifierRR();
    }

    public execute() {
      const toExecute = this.duration <= quantum ? this.duration : quantum;
      this.duration = this.duration - toExecute;

      this.state = PCBState.EXECUTING;
      return new Promise((resolve) => setTimeout(resolve, toExecute)).then(
        () => {
          if (this.duration === 0) {
            this.state = PCBState.DONE;

            setQueues([...queues]);

            planifierRR();
          } else {
            this.state = PCBState.READY;

            setQueues([...queues]);
          }
        }
      );
    }
  }

  const dispatcher = useCallback(async (process: PCB) => {
    await process.execute();
  }, []);

  const planifierRR = useCallback(async () => {
    for (let i = 0; i < queues.length; i++) {
      const queue = queues[i];

      if (queue.length == 0) continue;

      const valids = queue.filter((proceso) => proceso.state !== PCBState.DONE);

      setQueues([...queues]);

      if (valids.length > 0) {
        await dispatcher(
          valids.sort((v1, v2) => v1.priority - v2.priority)[0] as PCB
        );
        break;
      }
    }
  }, [dispatcher, queues]);

  const processCreator = useCallback(() => {
    class PCB implements PCB_PROPS {
      public id: number;
      public priority: number;
      public state: PCBState;
      public duration: number;

      constructor(queueNumber: number, priority = 0, duration?: number) {
        this.id = Math.floor(Math.random() * 100000);
        this.priority = priority;
        this.state = PCBState.READY;
        this.duration = duration ?? Math.floor(Math.random() * 1200);

        queues[queueNumber] = [...queues[queueNumber], this];

        setQueues([...queues]);
        planifierRR();
      }

      public execute() {
        const toExecute = this.duration <= quantum ? this.duration : quantum;
        this.duration = this.duration - toExecute;

        this.state = PCBState.EXECUTING;
        return new Promise((resolve) => setTimeout(resolve, toExecute)).then(
          () => {
            if (this.duration === 0) {
              this.state = PCBState.DONE;

              setQueues([...queues]);

              planifierRR();
            } else {
              this.state = PCBState.READY;

              setQueues([...queues]);
            }
          }
        );
      }
    }

    const priority = Math.floor(Math.random() * 100) % MAX_PRIORITY;
    const queueNumber = Math.floor(Math.random() * 100) % queues.length;

    if (queues[queueNumber].length >= maxPerQueue) planifierRR();
    else new PCB(queueNumber, priority);
  }, [maxPerQueue, planifierRR, quantum, queues]);

  // #endregion

  const cleanupDoneProcesses = useCallback(() => {
    setQueues((currentQueues) =>
      currentQueues.map((queue) =>
        queue.filter((process) => process.state !== PCBState.DONE)
      )
    );
  }, []);

  // #region Effects
  useEffect(() => {
    if (!started) {
      planifierRR();

      setStarted(true);
    }
  }, [started, quantum, queues, planifierRR]);

  useEffect(() => {
    setQueues((currentQueues) => {
      const newQueues = [...currentQueues].slice(0, queuesAmount);

      for (let i = 0; i < queuesAmount; i++) {
        newQueues[i] = newQueues[i] ? newQueues[i] : [];
      }

      return newQueues;
    });
  }, [queuesAmount]);

  useEffect(() => {
    if (!isRunning) return;

    const intervalKey = setInterval(() => processCreator(), creationInterval);

    const cleanupIntervalKey = setInterval(
      cleanupDoneProcesses,
      creationInterval * 15
    );

    return () => {
      clearInterval(intervalKey);
      clearInterval(cleanupIntervalKey);
    };
  }, [
    isRunning,
    queues,
    quantum,
    creationInterval,
    maxPerQueue,
    cleanupDoneProcesses,
    processCreator
  ]);
  // #endregion

  return {
    queues,
    cleanupDoneProcesses
  };
}
