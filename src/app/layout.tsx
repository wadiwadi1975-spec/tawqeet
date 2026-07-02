import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TWQEET — Global Gold Intelligence",
  description: "منصة الذهب الذكية — تحليل حي وتوصيات ذكية وأسعار فورية",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black",
    title: "TWQEET",
  },
};

export const viewport: Viewport = {
  themeColor: "#090909",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&display=swap"
          rel="stylesheet"
        />
        <script src="https://cdn.tailwindcss.com"></script>
        <script dangerouslySetInnerHTML={{ __html: `
          tailwind.config = {
            theme: {
              extend: {
                colors: {
                  background: '#090909',
                  foreground: '#f5f5f5',
                  card: '#0f0f0f',
                  'card-foreground': '#f5f5f5',
                  primary: '#D4AF37',
                  'primary-foreground': '#090909',
                  secondary: '#1a1a1a',
                  'secondary-foreground': '#f5f5f5',
                  muted: '#1a1a1a',
                  'muted-foreground': '#737373',
                  accent: '#D4AF37',
                  'accent-foreground': '#090909',
                  destructive: '#FF3D3D',
                  'destructive-foreground': '#fafafa',
                  border: '#262626',
                  input: '#262626',
                  ring: '#D4AF37',
                  gold: { DEFAULT: '#D4AF37', light: '#F5D76E', dark: '#A08020' },
                  emerald: '#00C853',
                  danger: '#FF3D3D',
                  warn: '#FFC107',
                },
                fontFamily: {
                  heading: ['Cairo', 'ui-sans-serif', 'system-ui', 'sans-serif'],
                  body: ['Cairo', 'ui-sans-serif', 'system-ui', 'sans-serif'],
                  display: ['Cairo', 'ui-sans-serif', 'system-ui', 'sans-serif'],
                },
              },
            },
          }
        `}} />
      </head>
      <body>{children}</body>
    </html>
  );
}
