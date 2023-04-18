import { useState } from 'react';

import ProcessCard from './ProcessCard/ProcessCard';
import Controler from './Controler/Controler';
import useSchedueler from 'hooks/useSchedueler';

const QUANTUM = 500;

function App() {
  const [quantum, setQuantum] = useState(QUANTUM);
  const [creationInterval, setCreationInterval] = useState(2500);
  const [maxPerQueue, setMaxPerQueue] = useState(10);
  const [queuesAmount, setQueuesAmount] = useState(3);
  const [isRunning, setIsRunning] = useState(true);

  function toggleisRunning() {
    setIsRunning(!isRunning);
  }

  const { queues, cleanupDoneProcesses } = useSchedueler({
    creationInterval,
    isRunning,
    maxPerQueue,
    quantum,
    queuesAmount
  });

  return (
    <div className="relative flex min-h-screen w-auto flex-col   bg-gray-900 p-8 font-mono text-white">
      <div className="flex  h-full flex-col items-center gap-1 overflow-y-hidden">
        <p className=" text-2xl ">Process Scheduler</p>

        <div className="flex w-fit gap-4 rounded-sm border  p-2">
          <div className="flex flex-col gap-1">
            <Controler
              name="quantum"
              label="Quantum"
              value={quantum}
              setValue={setQuantum}
              min={100}
              max={2000}
              unit="ms"
            />

            <Controler
              name="creationInterval"
              label="Creation interval"
              value={creationInterval}
              setValue={setCreationInterval}
              min={quantum + 50}
              max={20000}
              unit="ms"
            />

            <Controler
              name="queueLimit"
              label="Queue limit"
              value={maxPerQueue}
              setValue={setMaxPerQueue}
              min={1}
              max={15}
              unit=""
            />

            <Controler
              name="queueAmount"
              label="# of queues"
              value={queuesAmount}
              setValue={setQueuesAmount}
              min={1}
              max={10}
              unit=""
            />
          </div>
          <div className="flex flex-col gap-1">
            <button
              className="w-20 rounded-md border  bg-transparent p-2 transition hover:border-violet-400 hover:text-violet-400"
              onClick={toggleisRunning}
            >
              {isRunning ? 'PAUSE' : 'PLAY'}
            </button>

            <button
              className="w-20 rounded-md border bg-transparent p-2 transition hover:border-violet-400 hover:text-violet-400"
              onClick={cleanupDoneProcesses}
            >
              🧹
            </button>
          </div>
        </div>

        <div className="flex w-9/12 flex-col items-center rounded-sm border ">
          {queues.map((queue, indexQueue) => (
            <div
              key={`queue-${indexQueue}`}
              className="flex max-w-full flex-col items-center text-center"
            >
              <p className="inset-1">Queue #{indexQueue}</p>
              <div
                className="flex max-w-full flex-row space-x-2 overflow-x-auto p-2"
                style={{ height: 170 }}
              >
                {queue.map((process, indexProcess) => (
                  <ProcessCard
                    key={`queue-${indexQueue}-process-${indexProcess}-${process.id}`}
                    process={process}
                    width={150}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="fixed bottom-1 right-2">
        <p>
          Developed by{' '}
          <a
            className="transition hover:text-sky-700"
            href="https://github.com/marcobaldi97"
            target="_blank"
            rel="noreferrer"
          >
            Marco Baldi
          </a>
        </p>
      </div>
    </div>
  );
}

export default App;
