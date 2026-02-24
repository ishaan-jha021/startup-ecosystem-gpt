import './globals.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SplashScreen from './components/SplashScreen';
import DirectoryAdvisorBot from './components/DirectoryAdvisorBot';

export const metadata = {
  title: 'SEGPT — Startup Ecosystem GPT | AI-Powered Startup Advisor',
  description:
    'Discover the right grants, incubators, accelerators, and investors for your startup. AI-powered recommendations matched to your stage, sector, and geography.',
  keywords: 'startup, grants, incubators, accelerators, investors, AI advisor, Startup India',
  openGraph: {
    title: 'SEGPT — Startup Ecosystem GPT',
    description:
      'AI-powered startup ecosystem companion. Discover grants, incubators & investors matched to your profile.',
    type: 'website',
  },
};

import ThemeProvider from './components/ThemeProvider';

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ThemeProvider attribute="data-theme" defaultTheme="system" enableSystem>
          <SplashScreen />
          <Navbar />
          <main>{children}</main>
          <DirectoryAdvisorBot />
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}

