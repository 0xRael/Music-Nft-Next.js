"use client"
import { useState } from "react";

// When clicked open a popup, this popup uses links generated from {address} and {tokenId}
export function ShareButton({ address, tokenId }) {
    const [copySuccess, setCopySuccess] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    
    const togglePopup = () => {
        setIsOpen(!isOpen);
    };

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(`${window.location.origin}/view-nft/${address}/${tokenId}`);
            setCopySuccess('Copied!');
            // Reset the confirmation message after a delay
            setTimeout(() => setCopySuccess(''), 2000);
        } catch (err) {
            setCopySuccess('Failed to copy');
        }
    };
    
    return (
        <div className={"inline-block ml-2"}>
            <button
            onClick={togglePopup}
            className={"bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"}
            >
                Share
            </button>

            {/* This popup will be opened when pressing Share, allowing to pick a share option */}
            {isOpen && (
                <div className={"absolute rounded-md shadow-lg justify-between items-center z-20"} style={{
                    bottom: '25%',
                    right: '0%',
                    width: '25%',
                    height: '50%',
                    background: '#dddddddd'
                }}>
                    <ul className={"py-5"}>
                        <li>
                            <button
                                onClick={copyToClipboard}
                                className={"block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full"}
                            >
                                Copy Shareable Link
                            </button>
                        </li>
                        <li>
                            <a
                                href={`https://sepolia.etherscan.io/nft/${address}/${tokenId}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={"block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-center"}
                            >
                                    View on Etherscan
                            </a>
                        </li>
                        <li>
                            <a
                                href={`https://testnets.opensea.io/assets/sepolia/${address}/${tokenId}`}
                                target="_blank"
                                rel="noopener noreferrer"
		 className={"block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-center"}
                                >
                                    View on OpenSea
                            </a>
                        </li>
                    </ul>
                </div>
            )}
            {copySuccess && <span className={"ml-2 text-green-500"}>{copySuccess}</span>}
        </div>
    );
}