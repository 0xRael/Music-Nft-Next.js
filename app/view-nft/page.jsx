'use client'
import { NFTDisplay } from "@/components/nft-display"
import Transition from '@/components/transition'

export default function ViewNFT() {
    return (
        <Transition>
            <NFTDisplay />
        </Transition>
    )
}