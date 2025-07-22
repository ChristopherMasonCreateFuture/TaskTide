'use client';

import { useState } from 'react';
import { Menu, Palette } from 'lucide-react';
import { useTheme } from './theme-provider';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { themes } from '@/lib/themes';
import { cn } from '@/lib/utils';

export function ThemeSwitcher() {
  const { setTheme, theme: activeTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Open theme switcher</span>
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Select a Theme
          </SheetTitle>
        </SheetHeader>
        <div className="grid grid-cols-2 gap-4 py-8">
          {themes.map((theme) => (
            <div
              key={theme.name}
              onClick={() => {
                setTheme(theme.name);
                setIsOpen(false);
              }}
              className={cn(
                'cursor-pointer rounded-lg border-2 p-4 transition-all',
                activeTheme === theme.name ? 'border-primary' : 'border-border'
              )}
            >
              <h3 className="font-semibold mb-2 text-center">{theme.label}</h3>
              <div
                className="h-20 w-full rounded-md border-2 border-border"
                style={{
                  backgroundColor: `hsl(${theme.cssVars.light.background})`,
                }}
              >
                <div className="flex h-full w-full items-center justify-center p-2">
                  <div className="flex items-center gap-2">
                    <div
                      className="h-8 w-8 rounded-full"
                      style={{
                        backgroundColor: `hsl(${theme.cssVars.light.primary})`,
                      }}
                    />
                    <div
                      className="h-8 w-8 rounded-full"
                      style={{
                        backgroundColor: `hsl(${theme.cssVars.light.accent})`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
