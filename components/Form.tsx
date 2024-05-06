"use client";

import {
  MyMetadata,
  mintHypercert,
  ISOToUNIX,
  isValid,
  getChain,
} from "@/actions/hypercerts";
import { HypercertClient, AllowlistEntry } from "@hypercerts-org/sdk";
import {
  useWeb3ModalAccount,
  useWeb3ModalProvider,
} from "@web3modal/ethers/react";
import { useState, useRef, useEffect } from "react";
import { Chain, createWalletClient, custom, WalletClient } from "viem";
import toast from "react-hot-toast";
import axios from "axios";
import { useAppContext } from "@/context/appContext";
import { uploadImage } from "@/actions/upload";
import domToImage from "dom-to-image";
import TextArea, { convertArrayToDisplayText } from "@/components/TextArea";
import MyHypercert from "@/components/MyHypercert";
import ProgressPopup, { MethRes } from "@/components/Progress";
import { optimism, sepolia } from "viem/chains";
import { Eip1193Provider } from "ethers";
import { ErrorMessage, Field, Form, Formik } from "formik";

let currentYear = new Date();
let cY = currentYear.getFullYear();

function Page({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const nftStorageToken = process.env.NEXT_PUBLIC_NFTSTORAGE;
  const [allow, setAllow] = useState(false);
  const [allowList, setallowList] = useState<AllowlistEntry[]>([]);
  const [myworkScope, setWorkScopes] = useState<string>("");
  const [allowRange, setAllowRange] = useState<number>(50);
  const [myContributors, setContributors] = useState<string>("");
  const [workScopeStored, setWorkScopeStored] = useState<string[]>([]);
  const [hyperClient, setHyperClient] = useState<HypercertClient | undefined>(
    undefined
  );
  const [res, setRes] = useState<MethRes>();

  const [myWalletClient, setWalletClient] = useState<WalletClient | undefined>(
    undefined
  );
  const { walletProvider } = useWeb3ModalProvider();
  const [contributorsStored, setContributorsStored] = useState<any[]>([]);
  const [formImages, setFormImages] = useState({
    logoImage: "",
    bannerImage: "",
  });
  const { logoImage, bannerImage } = formImages;
  const { setCorrectNetwork, setIsWrongNetwork, roundColor } = useAppContext();
  const [isSuccess, setIsSuccess] = useState(false);
  const [isMinting, setIsMinting] = useState(false);
  const [formDates, setFormDates] = useState({
    workTimeframeStart: `${cY}-01-01`,
    workTimeframeEnd: currentYear.toISOString().slice(0, 10),
    impactTimeframeStart: `${cY}-01-01`,
    impactTimeframeEnd: currentYear.toISOString().slice(0, 10),
  });
  const { address, chainId } = useWeb3ModalAccount();
  const mychainId = searchParams.chainId as string;
  const roundId = searchParams.roundId as string;
  const dappChain = optimism;
  const initialState: MyMetadata = {
    name: "",
    description: "",
    external_url: "",
    image: "",
    version: "1.0",
    properties: undefined,
    impactScope: ["All"],
    excludedImpactScope: [],
    workScope: [],
    excludedWorkScope: [],
    workTimeframeStart: ISOToUNIX(new Date(formDates.workTimeframeStart)),
    workTimeframeEnd: ISOToUNIX(new Date(formDates.workTimeframeEnd)),
    impactTimeframeStart: ISOToUNIX(new Date(formDates.impactTimeframeStart)),
    impactTimeframeEnd: ISOToUNIX(new Date(formDates.impactTimeframeEnd)),
    contributors: ["john", "ada"],
    rights: ["Public Display"],
    excludedRights: [],
  };
  useEffect(() => {
    (() => {
      try {
        if (walletProvider) {
          let walletClient = createWalletClient({
            account: address,
            chain: dappChain,
            transport: custom(walletProvider as Eip1193Provider),
          });

          if (walletClient) {
            let myClient = new HypercertClient({
              chain: dappChain as any,
              walletClient: walletClient as any,
              nftStorageToken: nftStorageToken,
            });
            setWalletClient(walletClient);
            setHyperClient(myClient);
          } else {
            console.error("Failed to create wallet client.");
          }
        } else {
          console.error("wallet provider is not available.");
        }
      } catch (err) {
        console.error("Failed to create client:", err);
      }
    })();
  }, [address, nftStorageToken, walletProvider, dappChain]);

  const [formValues, setFormValues] = useState<MyMetadata>(initialState);
  const { name, description, external_url } = formValues;
  const [summedAmountUSD, setSumAmountUSD] = useState<number>(0);
  const cardRef = useRef<HTMLDivElement | undefined>(undefined);
  useEffect(() => {
    setAllow(false);
    if (mychainId && roundId && address) {
      toast.promise(
        (async () => {
          try {
            const res = await axios.get(
              `https://grants-stack-indexer.gitcoin.co/data/${mychainId}/rounds/${roundId}/applications.json`
            );
            const metaData = res.data;
            //let raddr = "0x4Be737B450754BC75f1ef0271D3C5dA525173F6b";
            const myItem: any = Array.from(metaData).find(
              (item: any) =>
                String(item.metadata.application.recipient).toLowerCase() ===
                address.toLowerCase()
            );
            if (myItem === undefined) {
              throw new Error("Item not found");
            }
            const votesRes = await axios.get(
              `https://grants-stack-indexer.gitcoin.co/data/${mychainId}/rounds/${roundId}/votes.json`
            );
            const projectData: any = Array.from(votesRes.data).find(
              (vote: any) => vote.projectId === myItem.projectId
            );
            const contributors: AllowlistEntry[] = Array.from(projectData).map(
              (vote: any) => {
                return {
                  address: vote.voter,
                  units: BigInt(Math.floor(vote.amountUSD)),
                };
              }
            );
            let summedAmount = 0;
            for (let index = 0; index < contributors.length; index++) {
              summedAmount = Number(contributors[index].units) + summedAmount;
            }
            setSumAmountUSD(summedAmount);
            setallowList(contributors);
            setContributorsStored(contributors);
            const options = convertArrayToDisplayText(contributors);
            setContributors(options);

            setFormValues({
              ...formValues,
              name: myItem.metadata.application.project.title,
              external_url: myItem.metadata.application.project.website,
              description: myItem.metadata.application.project.description,
            });
            setFormImages({
              logoImage: `https://ipfs.io/ipfs/${myItem.metadata.application.project.logoImg}`,
              bannerImage: `https://ipfs.io/ipfs/${myItem.metadata.application.project.bannerImg}`,
            });
            setWorkScopeStored([myItem.metadata.application.project.title]);
            setWorkScopes(myItem.metadata.application.project.title);
            setAllow(true);
          } catch (err) {
            console.error("Error:", err);
            throw err;
          }
        })(),
        {
          loading: "hypercert is being pre-filled.....",
          success: "Pre-fill Successful",
          error: "You don't have a grant application",
        }
      );
    }
  }, []);

  useEffect(() => {
    if (chainId !== Number(mychainId)) {
      setIsWrongNetwork(true);
      setCorrectNetwork(getChain(Number(mychainId)));
    }
  }, [chainId, mychainId, setCorrectNetwork, setIsWrongNetwork]);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };
  const handleImages = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormImages({
      ...formImages,
      [name]: value,
    });
  };
  const covertToBlob = async (ref: React.MutableRefObject<HTMLDivElement>) => {
    if (ref.current) {
      const myRef = cardRef.current;
      const imgBlob = await domToImage.toBlob(myRef as HTMLElement);
      return imgBlob;
    }
  };
  const handleRangeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setAllowRange(Number(value));
  };
  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    let percentage = allowRange / 100;
    let totalUnits = summedAmountUSD / percentage;
    let recipientUnits = totalUnits - summedAmountUSD;

    setFormValues({
      ...formValues,
      workScope: workScopeStored,
    });
    let newAllowlist: AllowlistEntry[] = [
      ...allowList,
      {
        address: address as string,
        units: BigInt(recipientUnits),
      },
    ];
    let curChainId = await myWalletClient?.getChainId();
    if (myWalletClient && curChainId !== dappChain.id) {
      myWalletClient.switchChain(dappChain);
    }
    if (isValid(formValues) && hyperClient && triggerRef.current) {
      setIsMinting(true);
      triggerRef.current.click();
      try {
        const hyperImage = await covertToBlob(
          cardRef as React.MutableRefObject<HTMLDivElement>
        );

        if (!hyperImage) {
          throw new Error("Hypercert image is invalid");
        }
        const imgHash = await uploadImage(hyperImage);
        if (!imgHash) {
          throw new Error("Image hash is undefined");
        }
        setFormValues({
          ...formValues,
          image: `ipfs://${imgHash}`,
        });
        console.log("Submit running");
        const res = await mintHypercert(
          formValues,
          hyperClient,
          newAllowlist,
          BigInt(totalUnits),
          chainId as number,
          walletProvider as Eip1193Provider
        );

        if (!res.allowlistTxHash) {
          throw new Error("Response is undefined");
        }
        setRes(res);
        setIsSuccess(true);
        setIsMinting(false);
      } catch (err) {
        setIsSuccess(false);
        setIsMinting(false);
        console.error("An error occurred:", err);
        throw err;
      }
    } else {
      console.error("A form value is invalid");
    }
  };

  const handleDates = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setFormDates({
      ...formDates,
      [name]: value,
    });
    let newDate = ISOToUNIX(new Date(value));
    setFormValues({
      ...formValues,
      [name]: newDate,
    });
  };

  return (
    <>
      <div
        className={`lg:flex md:flex block ${
          allow
            ? "lg:justify-center md:justify-center lg:space-x-[10%] md:space-x-[7%] mx-auto"
            : "lg:justify-center md:justify-center"
        }  h-fit py-[20px] w-full relative`}
      >
        <Formik
          initialValues={initialState}
          validate={(values) => {
            let errors: any = {};
            if (!values.name) {
              errors.name = "Required";
            } else if (!values.image) {
              errors.image = "Required";
            }
          }}
          onSubmit={(values, { setSubmitting }) => {}}
        >
          <Form
            className={`${
              allow ? "block" : "hidden"
            } lg:p-[40px] md:p-[30px] p-[20px] lg:w-[45%] md:w-[45%] w-[94%] space-y-3 rounded-[15px] morph lg:mx-0 md:mx-0 mx-auto`}
            onSubmit={onSubmit}
          >
            <hr />
            <p className={`text-[23px] text-violet-800 font-semibold`}>
              General Fields
            </p>
            <fieldset className={`w-[100%]`}>
              <label
                htmlFor="name"
                className={`text-white font-bold text-[16px] block mb-1`}
              >
                Hypercert Name
              </label>

              <Field
                type="text"
                id="name"
                name="name"
                value={name}
                maxLength={70}
                required
                onChange={handleChange}
                placeholder="The name of your hypercert"
                className={`w-[100%] h-[45px] ps-2 peer bg-white/50 placeholder:text-black/60 rounded-[6px] focus:outline-none text-black`}
              />
              <ErrorMessage
                name="name"
                component={`p`}
                className={`text-red-500 text-[13px] ps-[20px] italic`}
              />
            </fieldset>
            <fieldset className={`w-[100%]`}>
              <label
                htmlFor="logoImage"
                className={`text-white font-bold text-[16px] block mb-1`}
              >
                Logo Image
              </label>
              <Field
                type="text"
                id="logoImage"
                required
                name="logoImage"
                value={logoImage}
                onChange={handleImages}
                placeholder="Image URL"
                className={`w-[100%] h-[45px] peer ps-2 bg-white/50 placeholder:text-black/60  rounded-[6px] focus:outline-none text-black`}
              />
              <ErrorMessage
                name="logoImage"
                component={`p`}
                className={`text-red-500 text-[13px] ps-[20px] italic`}
              />
            </fieldset>
            <fieldset className={`w-[100%]`}>
              <label
                htmlFor="bannerImage"
                className={`text-white font-bold text-[16px] block mb-1`}
              >
                Banner Image
              </label>
              <Field
                type="text"
                id="bannerImage"
                name="bannerImage"
                value={bannerImage}
                onChange={handleImages}
                placeholder="Banner Image URL"
                className={`w-[100%] h-[45px] ps-2 bg-white/50 placeholder:text-black/60  rounded-[6px] focus:outline-none text-black`}
              />
              <ErrorMessage
                name="bannerImage"
                component={`p`}
                className={`text-red-500 text-[13px] ps-[20px] italic`}
              />
            </fieldset>
            <fieldset className={`w-[100%]`}>
              <label
                htmlFor="description"
                className={`text-white font-bold text-[16px] block mb-1`}
              >
                Description
              </label>
              <Field
                as="textarea"
                name="description"
                id="description"
                value={description}
                required
                onChange={handleChange}
                className={`w-[100%] p-2 peer h-[150px] bg-white/50 placeholder:text-black/60  rounded-[6px] focus:outline-none text-black`}
              />
              <ErrorMessage
                name="description"
                component={`p`}
                className={`text-red-500 text-[13px] ps-[20px] italic`}
              />
            </fieldset>
            <fieldset className={`w-[100%]`}>
              <label
                htmlFor="external_url"
                className={`text-white font-bold text-[16px] block mb-1`}
              >
                Link
              </label>
              <Field
                type="text"
                id="external_url"
                name="external_url"
                value={external_url}
                onChange={handleChange}
                placeholder="https://project.org"
                className={`w-[100%] h-[45px] ps-2 bg-white/50 placeholder:text-black/60  rounded-[6px] focus:outline-none text-black`}
              />
              <ErrorMessage
                name="external_url"
                component={`p`}
                className={`text-red-500 text-[13px] ps-[20px] italic`}
              />
            </fieldset>
            <hr />
            <p className={`text-[23px] text-violet-800 font-semibold`}>
              Hypercert Fields
            </p>
            <TextArea
              formValues={formValues}
              setFormValues={setFormValues}
              name="workScope"
              displayText={myworkScope}
              setDisplayText={setWorkScopes}
              setStoredValues={setWorkScopeStored}
              label="Work Scope"
            />
            <div
              className={`w-[100%] flex justify-center items-center space-x-2 h-[130px]`}
            >
              <fieldset className={`w-[48%]`}>
                <label
                  htmlFor="workTimeframeStart"
                  className={`text-white font-bold text-[16px] block mb-1`}
                >
                  Work Start Date
                </label>

                <input
                  type="date"
                  name="workTimeframeStart"
                  id="workTimeframeStart"
                  value={formDates.workTimeframeStart}
                  onChange={handleDates}
                  className={`w-[100%] h-[45px] ps-2 bg-white/50 placeholder:text-black/60  rounded-[6px] focus:outline-none text-black`}
                />
              </fieldset>
              <fieldset className={`w-[48%]`}>
                <label
                  htmlFor="workTimeframeEnd"
                  className={`text-white font-bold text-[16px] block mb-1`}
                >
                  Work End Date
                </label>
                <Field
                  type="date"
                  name="workTimeframeEnd"
                  id="workTimeframeEnd"
                  value={formDates.workTimeframeEnd}
                  onChange={handleDates}
                  className={`w-[100%] h-[45px] ps-2 bg-white/50 placeholder:text-black/60  rounded-[6px] focus:outline-none text-black`}
                />
              </fieldset>
            </div>

            {/* <div className={`w-[100%] rounded-[6px] bg-white/50 text-black p-3`}>
          <div
            className={`flex justify-between hover:cursor-pointer`}
            onClick={() => setIsOpen((prevOpen) => !prevOpen)}
          >
            <p className={`text-[23px] text-violet-800 font-semibold`}>
              Advanced Fields
            </p>

            {isOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="24"
                height="24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="18 15 12 9 6 15"></polyline>
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="24"
                height="24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            )}
          </div>
          <div className={`${isOpen ? "block space-y-2" : "hidden"}`}>
            <p className={`text-[13px] italic text-black`}>
              Advanced fields are currently not available for editing.
            </p>
            <div className={`w-[100%]`}>
              <fieldset className={`w-[100%]`}>
                <label
                  htmlFor="impactScope"
                  className={`text-white font-bold text-[16px] block mb-1`}
                >
                  Impact Scope
                </label>
                <select
                  name="impactScope"
                  id="impactScope"
                  disabled
                  multiple
                  value={impactScope}
                  className={`w-[100%] h-[45px] p-2 bg-white/40 placeholder:text-black/60  rounded-[6px] focus:outline-none border text-black`}
                >
                  <option value="all">All</option>
                </select>
              </fieldset>

              <div
                className={`w-[100%] flex justify-center items-center space-x-2 h-[130px]`}
              >
                <fieldset className={`w-[48%]`}>
                  <label
                    htmlFor="workTimeframeStart"
                    className={`text-white font-bold text-[16px] block mb-1`}
                  >
                    Impact Start Date
                  </label>
                  <input
                    type="date"
                    name="workTimeframeStart"
                    id="workTimeframeStart"
                    value={formDates.impactTimeframeStart}
                    disabled
                    onChange={handleDates}
                    className={`w-[100%] h-[45px] border ps-2 bg-white/40 placeholder:text-black/60  rounded-[6px] focus:outline-none text-black`}
                  />
                </fieldset>
                <fieldset className={`w-[48%]`}>
                  <label
                    htmlFor="workTimeframeEnd"
                    className={`text-white font-bold text-[16px] block mb-1`}
                  >
                    Impact End Date
                  </label>
                  <input
                    type="date"
                    name="workTimeframeEnd"
                    id="workTimeframeEnd"
                    value={formDates.impactTimeframeEnd}
                    onChange={handleDates}
                    disabled
                    className={`w-[100%] h-[45px] border ps-2 bg-white/40 placeholder:text-black/60  rounded-[6px] focus:outline-none text-black`}
                  />
                </fieldset>
              </div>
              <fieldset className={`w-[100%]`}>
                <label
                  htmlFor="rights"
                  className={`text-white font-bold text-[16px] block mb-1`}
                >
                  Usage Rights
                </label>
                <select
                  name="rights"
                  id="rights"
                  disabled
                  multiple
                  value={impactScope}
                  className={`w-[100%] h-[45px] p-2 rounded-[6px] bg-white/40 placeholder:text-black/60  focus:outline-none border text-black`}
                >
                  <option value="Public Display">Public Display</option>
                </select>
                <p
                  className={`text-red-600 italic invisible peer-required:visible`}
                >
                  *
                </p>
              </fieldset>
            </div>
          </div>
        </div> */}
            <hr />
            <p className={`text-[23px] text-violet-800 font-semibold`}>
              Distribution
            </p>

            <fieldset className={`w-[100%]`}>
              <label
                htmlFor="distribution"
                className={`text-white font-bold text-[16px] block mb-1`}
              >
                Percentage distributed via allow List
              </label>
              <div className={`flex w-full space-x-2 items-center`}>
                <Field
                  type="range"
                  step={1}
                  min={0}
                  max={100}
                  value={allowRange}
                  onChange={handleRangeChange}
                  name="distribution"
                  id="distribution"
                  className={`w-[90%] border-0 bg-white outline-none`}
                />
                <div
                  className={`w-[35px] flex justify-center items-center h-[35px] border border-gray-500`}
                >
                  <p>{allowRange}</p>
                </div>
              </div>
            </fieldset>

            <button
              type="submit"
              className={`px-1 border w-[100px] bg-white text-black hover:opacity-75 active:opacity-60 rounded-lg mx-auto h-[35px] block`}
            >
              Create
            </button>
          </Form>
        </Formik>

        <div
          className={`w-fit ${
            allow ? "block" : "hidden"
          } h-fit sticky top-[100px] p-[40px] lg:mx-0 md:mx-0 mx-auto`}
        >
          <MyHypercert
            startDate={formDates.workTimeframeStart}
            bannerPattern={roundColor.pattern}
            endDate={formDates.workTimeframeEnd}
            chain={getChain(Number(mychainId))}
            logoImg={logoImage}
            ref={cardRef}
            bannerImg={bannerImage}
            roundId={roundId as string}
            name={name}
            workScope={workScopeStored}
            gradient={roundColor.color}
          />
        </div>
      </div>
      <ProgressPopup
        ref={triggerRef}
        isSuccess={isSuccess}
        isMinting={isMinting}
        res={res as MethRes}
      />
    </>
  );
}

export default Page;
