import { AppProviders } from '@/components/providers';
import './globals.css';

export const metadata = {
  title: 'Quick Store Philippines',
  description: 'Efficiently manage locker inventory, assign lockers to clients, and track user access with the Quick Store Philippines Locker System. Secure, scalable, and easy to use.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AppProviders>
          {children}
        </AppProviders>
      </body>
    </html>
  );
}
