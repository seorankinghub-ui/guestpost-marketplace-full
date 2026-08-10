import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'GuestPost Marketplace — Digital PR & Guest Posting Service',
  description:
    'Place your content on 150,000+ high-quality websites. Get backlinks from real sites with verified metrics.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        style={{
          margin: 0,
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          color: '#1e293b',
          background: '#ffffff',
        }}
      >
        {children}
      </body>
    </html>
  );
}
