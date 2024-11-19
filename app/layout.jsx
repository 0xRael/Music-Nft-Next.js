import { Inter } from "next/font/google";
import "@/app/globals.css";
import { Providers } from "@/utils/providers";
import '@rainbow-me/rainbowkit/styles.css';
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from 'next/link';
import { motion } from 'framer-motion';

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Music NFT Marketplace",
  description: "Music NFT Marketplace",
};

function NavButton({ href, children}) {
  return (
    <motion.div className="mx-4 hover:underline"
    initial = {{ y: 0 }}
    whileHover = {{ y: 30 }}
    exit = {{ y: 0 }}
    >
      <Link href={href}>{children}</Link>
    </motion.div>
  )
}

function Header() {
  return (
    <header className="w-full sticky top-0 z-10 py-2 border-b-2 mb-5 border-[#eaeaea] backdrop-blur-sm">
      <nav className={"max-w-7xl mx-auto flex justify-between items-center"}>
        <div>
          <NavButton href="/marketplace">See the Market</NavButton>
          <NavButton href="/mint">Mint an NFT</NavButton>
          <NavButton href="/view-nft">View an NFT</NavButton>
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

        <footer className="w-full fixed bottom-0  border-t-2 border-[#eaeaea] justify-center items-center text-center backdrop-blur-sm">

          Made with &#10084; by 0xRael
        </footer>
      </body>
    </html>
  );
}