// import { setAutoFreeze } from 'immer';
// import { SidebarProvider } from '@/components/ui/sidebar';

export default function WorkflowLayout({children}: {children: React.ReactNode}) {

  // Disable immer's automatic object freezing because ReactFlow mutates objects under the hood
  // and requires this to be turned off to function properly, especially when node size is updated
  // setAutoFreeze(false);

  return (
    
              // <SidebarProvider
              //   style={{
              //     '--sidebar-width': '16rem',
              //     '--sidebar-width-mobile': '16rem',
              //   } as React.CSSProperties}
              // >
                <>{children}</>
               
              // </SidebarProvider>
            
  );
}
