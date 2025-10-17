// app/layout.tsx
import { Toaster } from 'sonner';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
        {children}
        <Toaster 
          position="bottom-right"
          expand={false}
          richColors
          closeButton
        />
    </>
  );
}
