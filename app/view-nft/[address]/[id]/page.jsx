'use client'
import { NFTDisplay } from "@/components/nft-display"
import { useParams } from "next/navigation"
import Transition from '@/components/transition'

export default function ViewNFT() {
    const params = useParams();

    return (
        <Transition>
            <NFTDisplay
            contractAddressProp={params.address}
            tokenIdProp={params.id}
            />
        </Transition>
    )
}