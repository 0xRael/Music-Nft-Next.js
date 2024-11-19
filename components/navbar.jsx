"use client"
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from 'next/link';
import { motion } from 'framer-motion';

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
  
export function Header() {
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