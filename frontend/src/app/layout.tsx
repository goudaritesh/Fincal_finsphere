import type { Metadata } from "next";
import "./globals.css";
import { TabProvider } from '@/context/TabContext';
import ClientLayout from '@/components/ClientLayout';

export const metadata: Metadata = {
  title: "FinCal Innovation | Smart Investor",
  description: "Intuitive, investor-friendly financial calculators co-sponsored by HDFC Mutual Fund.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased bg-gray-50 text-gray-900`}>
        <TabProvider>
          <ClientLayout>{children}</ClientLayout>
        </TabProvider>
      </body>
    </html>
  );
}
