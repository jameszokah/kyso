import { RootLayout } from '@/components/voice-ui/root-layout';

interface RootLayoutProps {
  children: React.ReactNode;
}

export default async function Layout({ children }: RootLayoutProps) {
  return <RootLayout className="bg-transparent">{children}</RootLayout>;
}
