import { DiagramWrapper } from '@/features/diagram/diagram-wrapper';
import { DiagramContainer as Diagram } from '@/features/diagram/diagram';
import VoiceFlow from '@/flows/voice';

export default function Home() {
  return (
    <div className="">
       {/* <Cursor /> */}
                {/* Diagram - render first so it's behind UI elements */}
                <div className="absolute inset-0 z-0">
                  <DiagramWrapper>
                    <Diagram />
                  </DiagramWrapper>
                </div>

                <VoiceFlow />
                {/* <Environment>
                  <OrnamentBar />
                </Environment> */}
    </div>
  );
}
