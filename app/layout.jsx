import { Inter } from "next/font/google";
import "@/app/globals.css";
import { Providers } from "@/utils/providers";
import '@rainbow-me/rainbowkit/styles.css';
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from 'next/link';

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Music NFT Marketplace",
  description: "Music NFT Marketplace",
};

function Header() {
  return (
    <header className={"w-full sticky top-0 z-10 py-2 border-b-2 mb-5 border-[#eaeaea]"}>
      <nav className={"max-w-7xl mx-auto flex justify-between items-center"}>
        <div>
          <Link className={"mx-4"} href="/marketplace">See the Market</Link>
          <Link className={"mx-4"} href="/mint">Mint an NFT</Link>
          <Link className={"mx-4"} href="/view-nft">View an NFT</Link>
        </div>
        <ConnectButton />
      </nav>
    </header>
  )
}

export default function pageWrapper ({
  children,
}) {

  return (
    <html lang="en">
      <body className={inter.className+" bg-gray-800 h-screen"}>
        <div className={"px-12 h-screen"}>
          <Providers >
            <Header />
            <div>
               {children}
            </div>
          </Providers>
        </div>

        <footer className={"w-full fixed bottom-0  border-t-2 border-[#eaeaea] justify-center items-center text-center"}>

          Made with &#10084; by 0xRael
        </footer>
      </body>
    </html>
  );
}