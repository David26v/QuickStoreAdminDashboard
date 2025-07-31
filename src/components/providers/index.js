"use client";

import { AlertProvider } from "./AlertProvider";
import { DialogProvider } from "./DialogProvider";
import { LoadingProvider } from "./LoadingProvider";
import { UserProvider } from "./UserContext";
import { ThemeProvider } from "./themeProvider";

export function AppProviders({ children }) {
  return (
    <ThemeProvider>
      <LoadingProvider>
        <AlertProvider>
          <DialogProvider>
            <UserProvider>{children}</UserProvider>
          </DialogProvider>
        </AlertProvider>
      </LoadingProvider>
    </ThemeProvider>
  );
}
