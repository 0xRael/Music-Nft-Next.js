import { Inter } from "next/font/google";
import "@/app/globals.css";
import { Providers } from "@/utils/providers";
import '@rainbow-me/rainbowkit/styles.css';
import { Header } from "@/components/navbar"

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Music NFT Marketplace",
  description: "Music NFT Marketplace",
};

export default function pageWrapper ({
  children,
}) {

  return (
    <html lang="en">
      <body className={inter.className+" h-screen"}>
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