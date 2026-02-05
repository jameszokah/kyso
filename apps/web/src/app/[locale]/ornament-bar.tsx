// import Link from 'next/link'
// import { StartupAudio } from '@/components/audio/startup-audio'
import { Button } from '@/components/core/button';
import { Ornament, OrnamentContentBase, OrnamentContents, OrnamentTab, OrnamentTabs } from '@/components/core/ornament';
// import { AppStoreIcon, EnvironmentsIcon, PeopleIcon } from '@/components/icons'
import { Text } from '@/components/ui/typography';
import { AppStoreLogoIcon, EnvelopeIcon, PhoneIcon } from '@phosphor-icons/react';
// import EnvironmentView from './environment-view'
import VoiceFlow from '@/flows/voice';
import { IntersectIcon } from '@phosphor-icons/react/dist/ssr';

export const dynamic = 'force-dynamic';

function OrnamentBar() {
  return (
    <>
      {/* <StartupAudio src="/assets/audio/home-startup.MP3" volume={0.6} /> */}
      <Ornament defaultTab="apps" className="w-full h-full">
        <OrnamentTabs className="h-full">
          <OrnamentTab icon={<AppStoreLogoIcon data-slot="icon" />} label="Voice" value="voice" />
          <OrnamentTab icon={<PhoneIcon data-slot="icon" />} label="Phone Number" value="phone" />
          <OrnamentTab icon={<IntersectIcon data-slot="icon" />} label="Integrations" value="integrations" />
          <OrnamentTab icon={<EnvelopeIcon data-slot="icon" />} label="Environments" value="environments" />
        </OrnamentTabs>
        <OrnamentContents>
          <OrnamentContentBase value="voice" key="voice" className="h-full">
            <VoiceFlow />
          </OrnamentContentBase>
          <OrnamentContentBase value="phone" key="phone" className="h-full">
            {/* <PhoneFlow /> */}
            <div className="flex flex-col items-center justify-center gap-4 text-center">
              <Text variant="secondary" size="XLTitle2">
                Coming Soon...
              </Text>
              {/* <Link href="/docs"> */}
              <Button>View Docs</Button>
              {/* </Link> */}
              <p className="text-xs opacity-50">Created by Phone View</p>
            </div>
          </OrnamentContentBase>
          <OrnamentContentBase value="integrations" key="integrations">
            <div className="flex flex-col items-center justify-center gap-4 text-center">
              <Text variant="secondary" size="XLTitle2">
                Coming Soon...
              </Text>
              {/* <Link href="/docs"> */}
              <Button>View Docs</Button>
              {/* </Link> */}
              <p className="text-xs opacity-50">
                Created by People View
                {/* <Link
                  href="https://twitter.com/useOptimistic"
                  className="font-semibold text-fd-foreground underline"
                >
                  Oliver
                </Link>
                <br />
                Docs powered by{' '}
                <Link
                  href="https://fumadocs.vercel.app/"
                  className="font-semibold text-fd-foreground underline"
                >
                  Fumadocs
                              </Link>
                              */}
              </p>
            </div>
          </OrnamentContentBase>
          <OrnamentContentBase value="environments" key="environments">
            {/* <EnvironmentView /> */}
            <div className="flex flex-col items-center justify-center gap-4 text-center">
              <Text variant="secondary" size="XLTitle2">
                Coming Soon...
              </Text>
              {/* <Link href="/docs"> */}
              <Button>View Docs</Button>
              {/* </Link> */}
              <p className="text-xs opacity-50">Created by Environments View</p>
            </div>
          </OrnamentContentBase>
        </OrnamentContents>
      </Ornament>
    </>
  );
}

export default OrnamentBar;
