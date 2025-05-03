'use client';

import * as React from 'react';
import { Palette } from 'lucide-react';
import { useTheme } from '@/context/theme-context'; // Use custom hook
import { themes } from '@/lib/themes'; // Import themes config

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

// Helper to capitalize theme names for display
const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1).replace(/_/g, ' ');

export function ColorPaletteSelector() {
  const { setTheme, availableThemes, theme: currentTheme } = useTheme(); // Use custom hook

  // Ensure component only renders on client where context is available
  const [isClient, setIsClient] = React.useState(false);
  React.useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    // Render nothing or a placeholder during SSR/build
    return null;
  }

  return (
    <TooltipProvider>
      <DropdownMenu>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Palette className="h-[1.2rem] w-[1.2rem] transition-transform duration-300 group-hover:rotate-[15deg]" />
                <span className="sr-only">Cambiar paleta de colores</span>
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>Seleccionar paleta</p>
          </TooltipContent>
        </Tooltip>
        <DropdownMenuContent align="end">
          {availableThemes.map((themeName) => (
            <DropdownMenuItem
              key={themeName}
              onClick={() => setTheme(themeName)}
              disabled={themeName === currentTheme} // Disable current theme
            >
              {capitalize(themeName)}
              {/* Optional: Add a visual indicator for the current theme */}
              {/* {themeName === currentTheme && <Check className="ml-2 h-4 w-4" />} */}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </TooltipProvider>
  );
}
