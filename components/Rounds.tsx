"use client";

import { myChains } from "@/providers/Walletprovider";

import HyperCertCard from "./HyperCertCard";

function Rounds() {
  const { pgn, polygon, optimism } = myChains;
  return (
    <div
      className={`w-full flex justify-center items-center lg:py-[60px] py-[40px] md:py-[90px] lg:my-[100px] md:my-[100px] my-[70px]`}
    >
      <div
        className={`grid lg:grid-cols-4 md:grid-cols-3 grid-cols-1 w-full gap-x-[3%] gap-y-[20px] lg:px-[100px] md:px-[100px] px-[20px]`}
      >
        <HyperCertCard
          roundId="0x5eB890e41c8D2cFF75ea942085E406bB90016561"
          name="GGI9: Climate"
          bannerImg="/pg1.webp"
          logoImg="/logo.webp"
          chain={optimism}
          bannerPattern="/svg/patt3.png"
          gradient="rgb(153,50,204)"
        />
        <HyperCertCard
          roundId="0xa1D52F9b5339792651861329A046dD912761E9A9"
          name="GG19: Infra"
          logoImg="/logo.webp"
          bannerImg="/pg2.webp"
          chain={polygon}
          bannerPattern="/svg/patt9.png"
          gradient="rgb(255,102,102)"
        />
        <HyperCertCard
          roundId="0xd4CC0dd193c7DC1d665AE244cE12D7FAB337a008"
          bannerImg="/pg3.webp"
          logoImg="/logo.webp"
          name="GG19: OSS"
          bannerPattern="/svg/rand.png"
          gradient="rgb(34,61,104)"
          chain={pgn}
        />
        <HyperCertCard
          roundId="0x98720dD1925d34a2453ebC1F91C9d48E7e89ec29"
          name="GG19: Community and Ed"
          bannerImg="/pg5.webp"
          logoImg="/logo.webp"
          gradient="rgb(223,221,67)"
          chain={pgn}
          bannerPattern="/svg/patt10.png"
        />
      </div>
    </div>
  );
}

export default Rounds;
