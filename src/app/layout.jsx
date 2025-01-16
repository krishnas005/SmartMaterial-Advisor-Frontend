import "./globals.css";
import { PartProvider } from '@/context/PathContext';
import Script from 'next/script';

export const metadata = {
  title: "SmartMaterial  Advisor",
  description: "Tata's Sustainability Platform!!",
};

const id = process.env.CHATBOT_ID

export default function RootLayout({
  children
}) {
  return (
    <html lang="en">
      <head>
        <Script
          id="chatbot-config-script"
          dangerouslySetInnerHTML={{
            __html: `
              window.embeddedChatbotConfig = {
                chatbotId: ${id},
                domain: "www.chatbase.co"
              };
            `,
          }}
        />
        <Script
          src="https://www.chatbase.co/embed.min.js"
          strategy="afterInteractive" 
          data-chatbot-id={id}
          data-domain="www.chatbase.co"
        />
      </head>
      <body>
        <PartProvider>
          <div className="relative flex size-full min-h-screen flex-col bg-slate-50 group/design-root overflow-x-hidden" style={{ fontFamily: '"Work Sans", "Noto Sans", sans-serif' }}>
            <div className="layout-container flex h-full grow flex-col">{children}</div>
          </div>
        </PartProvider>
      </body>
    </html>
  );
}