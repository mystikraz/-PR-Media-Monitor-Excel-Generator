import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'PR Media Monitor & Excel Generator',
  description: 'Professional PR media monitoring daily update generator with customizable columns, row headers, image uploads with links, auto-formatting, and styled Excel (.xlsx) export.',
  openGraph: {
    title: 'PR Media Monitor & Excel Generator',
    description: 'Professional PR media monitoring daily update generator with customizable columns, row headers, image uploads with links, auto-formatting, and styled Excel (.xlsx) export.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PR Media Monitor & Excel Generator',
    description: 'Professional PR media monitoring daily update generator with customizable columns, row headers, image uploads with links, auto-formatting, and styled Excel (.xlsx) export.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
