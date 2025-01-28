import type { Metadata } from "next";
import "./globals.css";
import  {Roboto,Ubuntu,Macondo} from "next/font/google"
import localFont from "next/font/local";

const roboto = Roboto(
{
  variable: '--font-roboto',
  subsets: ['latin'],
  weight: ['100','300'],
})

const ubuntu = Ubuntu(
{
  variable: '--font-ubuntu',
  subsets: ['latin'],
  weight:['300']
})

const macondo = Macondo(
{
  variable: '--font-macondo',
  subsets: ['latin'],
  weight:['400'],
  display: 'swap'

})

const playwrite = localFont(
{
  src: "./fonts/PlaywriteVN-Regular.ttf",
  variable: "--font-playwrite-regular",
  weight: "400"
})

export const metadata: Metadata = {
  title: "Mathan Prasanna Kumar",
  description: "Portfolio of mine",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="">
        {children}
      </body>
    </html>
  );
}
