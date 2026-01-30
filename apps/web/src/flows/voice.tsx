import { AppBarContainer } from '../features/app-bar/app-bar-container';
import { AppLoaderContainer } from '../features/app-loader/app-loader-container';
import { PaletteSidebar } from '../features/palette/palette-container';
import { PropertiesBarContainer } from '../features/properties-bar/properties-bar-container';
import { SnackbarContainer } from '../features/snackbar/snackbar-container';

export default function VoiceFlow({ workflowId }: { workflowId?: string }) {
  return (
    <div className="absolute flex flex-col h-full w-full overflow-hidden pointer-events-none">
      {/* Header */}
      <div className="flex justify-between box-border w-full p-4 z-10 gap-4 pointer-events-auto">
        <AppBarContainer workflowId={workflowId || ''} />
      </div>

      {/* Content */}
      <div className="relative w-full h-full px-4 pb-4 box-border flex justify-between overflow-visible">
        <div className="h-full flex z-10 pointer-events-auto ml-8">
          <PaletteSidebar />
        </div>

        <div className="h-full flex flex-col gap-4 items-end justify-between z-10 pointer-events-auto">
          <PropertiesBarContainer />
        </div>
      </div>

      <SnackbarContainer />
      <AppLoaderContainer />
    </div>
  );
}
