import type {Metadata} from 'next';
import {Geist, Geist_Mono} from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "@/context/theme-context"; // Import custom provider
import { ColorPaletteSelector } from '@/components/color-palette-selector'; // Import new selector

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Tiempo Productivo',
  description: 'Aplicación Pomodoro y gestor de tareas',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider> {/* Use custom ThemeProvider */}
          <div className="absolute top-4 right-4 z-50">
             <ColorPaletteSelector /> {/* Use new ColorPaletteSelector */}
          </div>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
