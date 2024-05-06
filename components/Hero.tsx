"use client";

import HyperCertCard from "./HyperCertCard";
import { myChains } from "@/providers/Walletprovider";

function Hero() {
  return (
    <div
      className={`lg:grid md:grid block grid-cols-3 w-full h-fit lg:p-[100px] lg:gap-x-[13%] md:gap-x-[13%] md:p-[60px] p-[20px] space-y-2 mt-[90px]`}
    >
      <HyperCertCard
        name="GG19: Climate"
        roundId="0x5eB890e41c8D2cFF75ea942085E406bB90016561"
        bannerImg="/pg1.webp"
        bannerPattern="/svg/patt3.png"
        logoImg="/logo.webp"
        chain={myChains.optimism}
        gradient="rgb(153,50,204)"
      />

      <div
        className={`col-span-2 flex-grow flex-col flex space-y-4 morph p-[10px] lg:mx-0 md:mx-0 mx-auto`}
      >
        <p
          className={`bg-gradient-to-r from-black via-slate-700 to-gray-500 text-transparent text-center inline-block bg-clip-text lg:text-[55px] md:text-[50px] text-[25px] font-extrabold `}
        >
          Mint Your Hypercerts
        </p>
        <div className={`w-[95%] block lg:p-6 md:p-4 p-3 text-[20px]`}>
          <p className={``}>
            HyperMinter is a tool for minting a Hypercert to make an onchain
            claim of the impact your project will make with the grant funding
          </p>
          <ul className={`list-disc`}>
            <li>Connect the grant payout wallet</li>
            <li>Click mint on the round you participated in</li>
            <li>Modifiy the form that is generated and mint your Hypercert</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Hero;
