import { useMemo } from 'react';
import { PCB, PCBState } from 'planificadorPCB';

interface ProcessCardProps {
  process: PCB;
}

export default function ProcessCard({ process }: ProcessCardProps) {
  const bgColor = useMemo(() => {
    switch (process.state) {
      case PCBState.READY:
        return 'bg-cyan-200';
      case PCBState.EXECUTING:
        return 'bg-green-600';
      case PCBState.DONE:
        return 'bg-gray-400';
    }
  }, [process.state]);

  return (
    <div
      className={`relative h-32 w-32 place-content-end ${bgColor} text-black shadow shadow-stone-300 transition-colors`}
    >
      <p className=" font-semibold">DL: {process.duration} ms</p>
      <p className=" font-semibold">PO: {process.priority}</p>

      <p className="absolute bottom-2 right-2 font-bold">#{process.id}</p>
    </div>
  );
}
