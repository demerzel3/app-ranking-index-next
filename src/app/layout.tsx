import './globals.css';

export const metadata = {
  title: 'App Ranking Index',
  description: 'Buy the bottom, sell the top. Powered by the App Store.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
