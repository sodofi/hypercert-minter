import { Raleway } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { Metadata } from "next";
import WalletProvider from "../providers/Walletprovider";
import { Toaster } from "react-hot-toast";
import Footer from "@/components/Footer";

const inter = Raleway({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Hyperminter",
  description: "A tool for minting project based Hypercerts onchain.",

  openGraph: {
    type: "website",
    title: "Hyperminter",
    url: "https://hyperminter.xyz",
    description: "A tool for minting project based Hypercerts onchain.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} relative nico bg-cover min-h-[100vh] flex flex-col`}
      >
        <WalletProvider>
          <Toaster />
          <Navbar />
          {/* <div
            className={`fixed top-[90px] left-0 h-[35px] z-[24] text-white bg-blue-500 flex w-full text-center justify-center items-center`}
          >
            The minter is temporarily down for maintenance!
          </div> */}
          <div className={``}>{children}</div>
          <Footer />
        </WalletProvider>
      </body>
    </html>
  );
}
