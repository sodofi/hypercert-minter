import Hero from "@/components/Hero";
import Rounds from "@/components/Rounds";

function Home() {
  return (
    <main className={`block h-fit w-full pt-[20px] relative lg:pt-[20px]`}>
      
      <Hero />
      <Rounds />
    </main>
  );
}

export default Home;
