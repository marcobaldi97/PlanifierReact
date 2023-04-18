import { useMemo } from 'react';
import { PCB, PCBState } from 'PCB_Schedueler';

interface ProcessCardProps {
  process: PCB;
  width: number;
}

export default function ProcessCard({ process, width }: ProcessCardProps) {
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
      className={`relative place-content-end ${bgColor} shrink-0 text-black shadow shadow-stone-300 transition-colors `}
      style={{
        width: width,
        height: width
      }}
    >
      <p className=" font-semibold">DL: {process.duration} ms</p>
      <p className=" font-semibold">PO: {process.priority}</p>

      <p className="absolute bottom-2 right-2 font-bold">#{process.id}</p>
    </div>
  );
}
