'use client'
import { NFTDisplay } from "@/utils/nft-display"
import { useParams } from "next/navigation"

export default function ViewNFT() {
    const params = useParams();

    return (
        <NFTDisplay
        contractAddressProp={params.address}
        tokenIdProp={params.id}
        />
    )
}