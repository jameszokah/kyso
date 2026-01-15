
import { setAutoFreeze } from 'immer';
import { DiagramWrapper } from '@/features/diagram/diagram-wrapper';
import { DiagramContainer as Diagram } from '../features/diagram/diagram';


// Plugins entry point
import '@/features/plugins/index';
import { SidebarProvider } from '@/components/ui/sidebar';
import VoiceFlow from '../flows/voice';

export function App() {
  // useDetectLanguageChange();

  // Disable immer's automatic object freezing because ReactFlow mutates objects under the hood
  // and requires this to be turned off to function properly, especially when node size is updated
  setAutoFreeze(false);

  return (
    
              <SidebarProvider
                style={{
                  '--sidebar-width': '16rem',
                  '--sidebar-width-mobile': '16rem',
                }}
              >
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
              </SidebarProvider>
            
  );
}
