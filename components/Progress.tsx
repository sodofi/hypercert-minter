"use client";

import { getChain } from "@/actions/hypercerts";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { useWeb3ModalAccount } from "@web3modal/ethers/react";
import { motion } from "framer-motion";
import Link from "next/link";

import { forwardRef } from "react";
export type MethRes = {
  allowlistTxHash: `0x${string}` | undefined;
  claimsTxHash: `0x${string}` | undefined;
};

interface ProgressProps {
  res: MethRes;
  isSuccess: boolean;
  isMinting: boolean;
}

const ProgressPopup = forwardRef(function ProgressPopup(
  props: ProgressProps,
  ref
) {
  const { res, isSuccess, isMinting } = props;

  const Monitor = () => {
    const { chainId } = useWeb3ModalAccount();
    const currentChain = getChain(chainId as number);

    if (isMinting) {
      return (
        <div className="loader">
          <div className="circles">
            <span className="one"></span>
            <span className="two"></span>
            <span className="three"></span>
          </div>
          <div className="pacman">
            <span className="top"></span>
            <span className="bottom"></span>
            <span className="left"></span>
            <div className="eye"></div>
          </div>
        </div>
      );
    } else if (!isMinting && isSuccess) {
      return (
        <div className={`w-full items-center space-y-2 h-[70%]`}>
          <div
            className={`w-[140px] mx-auto flex justify-center items-center h-[140px] rounded-full`}
          >
            <motion.svg
              width={150} // Adjust the width as needed
              height={150} // Adjust the height as needed
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 400 400"
              className={`block mx-auto`}
            >
              <motion.circle
                fill={`none`}
                stroke="#68E534"
                strokeWidth={20}
                cx={200}
                cy={200}
                r={190}
                strokeLinecap={`round`}
                transform={`rotate(-90 200 200)`}
                strokeDasharray={1194}
                strokeDashoffset={1194}
                initial={{ strokeDashoffset: 1194 }}
                animate={{
                  strokeDashoffset: 2388,
                  animationFillMode: "forwards",
                  transition: { duration: 1, ease: "easeInOut" },
                }}
              />
              <motion.polyline
                fill="none"
                stroke="#68E534"
                points="88,214 173,284 304,138"
                strokeWidth="24"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="tick"
                strokeDasharray={350}
                strokeDashoffset={350}
                initial={{ strokeDashoffset: 350 }}
                animate={{
                  strokeDashoffset: 0,
                  animationFillMode: "forwards",
                  animationDelay: "0.95s",
                  transition: { ease: "easeOut", duration: 0.8 },
                }}
              />
            </motion.svg>
          </div>
          <p className={`text-[18px] text-green-600`}>
            Transaction Successful!
          </p>
          <pre className={`block text-[16px]`}>
            Tx Hash:
            <Link
              target={`_blank`}
              href={`${currentChain.blockExplorers.default.url}/tx/${res.claimsTxHash}`}
              className={`text-sky-500`}
            >{` ${res.claimsTxHash?.slice(0, 15)}...${res.claimsTxHash?.slice(
              -15
            )}`}</Link>
          </pre>
        </div>
      );
    } else {
      return (
        <div className={`w-full flex justify-center items-center h-[70%]`}>
          <div
            className={`w-[140px] flex justify-center items-center h-[140px] rounded-full`}
          >
            <motion.svg
              viewBox="0 0 87 87"
              version="1.1"
              width={100}
              height={100}
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              className={`block mx-auto`}
            >
              <motion.g
                id="Page-1"
                stroke="none"
                strokeWidth="1"
                fill="none"
                fillRule="evenodd"
              >
                <motion.g
                  id="Group-2"
                  transform="translate(2.000000, 2.000000)"
                >
                  <motion.circle
                    id="Oval-2"
                    stroke="rgba(252, 191, 191, .5)"
                    strokeWidth={4}
                    cx={41.5}
                    cy={41.5}
                    r={41.5}
                  />
                  <motion.circle
                    className="ui-error-circle"
                    stroke="#F74444"
                    strokeWidth={4}
                    cx={41.5}
                    cy={41.5}
                    r={41.5}
                    strokeDasharray={260.75219024795285}
                    strokeDashoffset={260.75219024795285}
                    transition={{
                      duration: 1.2,
                      ease: "linear",
                      times: [0, 0.35, 0.7, 1],
                    }}
                    animate={{
                      strokeDasharray: [
                        "0, 260.75219024795285px",
                        "120px 120px",
                        "0, 260.75219024795285px",
                        "260.75219024795285px, 0",
                      ],
                      strokeDashoffset: [
                        "0",
                        "-120px",
                        "-260.75219024795285px",
                        "-260.75219024795285px",
                      ],
                    }}
                  />
                  <motion.path
                    className="ui-error-line1"
                    d="M22.244224,22 L60.4279902,60.1837662"
                    id="Line"
                    stroke="#F74444"
                    strokeWidth={3}
                    strokeLinecap={"square"}
                    strokeDasharray={"54px 55px"}
                    strokeDashoffset={55}
                    transition={{
                      duration: 0.15,
                      delay: 1.2,
                      ease: "linear",
                      repeat: 1,
                    }}
                    animate={{ strokeDashoffset: 0 }}
                  />
                  <motion.path
                    className="ui-error-line2"
                    d="M60.755776,21 L23.244224,59.8443492"
                    id="Line"
                    stroke="#F74444"
                    strokeWidth={3}
                    strokeDasharray={"54px 55px"}
                    strokeDashoffset={55}
                    strokeLinecap={"square"}
                    transition={{
                      duration: 0.2,
                      delay: 0.9,
                      ease: "linear",
                      repeat: 1,
                    }}
                    animate={{ strokeDashoffset: 0 }}
                  />
                </motion.g>
              </motion.g>
            </motion.svg>
          </div>
        </div>
      );
    }
  };
  const handleClick = () => {
    if (isSuccess) {
      window.location.assign("/");
    }
  };
  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger asChild>
        <button ref={ref as React.LegacyRef<HTMLButtonElement>}></button>
      </AlertDialog.Trigger>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="fixed bg-neutral-900/90 inset-0 backdrop-blur z-[30]" />
        <AlertDialog.Content className="fixed focus:outline-none drop-shadow-md border z-[31] border-neutral-700 top-[50%] left-[50%] h-[300px] lg:w-[38%] md:w-[38%] w-[90%] translate-y-[-50%] translate-x-[-50%] rounded-md bg-white p-[2%]">
          <AlertDialog.Title
            className={`block lg:text-[25px] md:text-[20px] text-[19px] font-bold`}
          >
            Processing Hypercert
          </AlertDialog.Title>
          {isMinting && (
            <AlertDialog.Description
              className={`block lg:text-[16px] md:text-[17px] text-[16px] text-neutral-700`}
            >
              Please keep this tab open until completion
            </AlertDialog.Description>
          )}
          {!isMinting && (
            <AlertDialog.Cancel asChild>
              <button
                className={`w-[25px] h-[25px]  absolute flex justify-center items-center right-2 top-2 rounded-full bg-black`}
                onClick={handleClick}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="18"
                  height="18"
                >
                  <path d="M0 0h24v24H0z" fill="none" />
                  <path
                    d="M18 6L6 18M6 6l12 12"
                    stroke="#ffffff"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </AlertDialog.Cancel>
          )}
          <Monitor />
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
});

export default ProgressPopup;
