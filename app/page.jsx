'use client'
import Link from 'next/link'
import Transition from '@/components/transition'

export default function Home() {
  return (
      <Transition>
        <div className={" min-h-[90vh] flex justify-center items-center font-sans max-[1000px]:w-full max-[1000px]:flex-col max-[1000px]:justify-center max-[1000px]:items-center  "}>
          <h1 className="text-4xl my-8  mx-0 ">
            Welcome!
          </h1>
          <ul>
            <li>
              <Link href="/marketplace">See the Market</Link>
            </li>
            <li>
              <Link href="/mint">Mint an NFT</Link>
            </li>
            <li>
              <Link href="/view-nft">View an NFT</Link>
            </li>
          </ul>
        </div>
      </Transition>
  );
}