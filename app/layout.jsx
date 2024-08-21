import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/utils/providers";
import '@rainbow-me/rainbowkit/styles.css';
import { ConnectButton } from "@rainbow-me/rainbowkit";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Music NFT Marketplace",
  description: "Music NFT Marketplace",
};

export default function RootLayout({
  children,
}) {
  const renderButton = () => {
    // if (address) {
    // //if the user has connected their wallet,
    //   <div>Wallet connected</div>;
    // } else {
      
    // }
    return (
      // if the user hasn't connected their wallet, show them a connect wallet button
       <ConnectButton />
       // this button is provided to us by RainbowKit itself
      );
  };

  return (
    <html lang="en">
      <head>
      </head>
      <body className={inter.className+" bg-gray-800 h-screen"}>
        <div className={"px-12 h-screen"}>
          <Providers >
            <header className={"w-full sticky top-0 z-10 py-2 border-b-2 mb-5 border-[#eaeaea]"}>
                  { renderButton() }
            </header>
            {children}
          </Providers>
        </div>

        <footer className={"w-full fixed bottom-0  border-t-2 border-[#eaeaea] justify-center items-center text-center"}>

          Made with &#10084; by 0xRael
         </footer>
      </body>
    </html>
  );
}