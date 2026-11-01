import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Takeo Natural Gemstones',
  description: 'Natural gemstones and jewelry from Takeo, Cambodia.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
