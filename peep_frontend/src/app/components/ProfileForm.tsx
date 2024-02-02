import React, { useRef, useState } from "react";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { AvatarProfile } from "./Avatar";
import { Camera, CameraIcon, X as LucideX } from "lucide-react";
import { Cross2Icon } from "@radix-ui/react-icons";
import { useRollups } from "../useRollups";
import { ethers } from "ethers";
import { usePeepsContext } from "../context";
import { defaultDappAddress } from "../utils/constants";
import { ButtonLoader } from "./Button";
import toast from "react-hot-toast";

export const ProfileForm = () => {
  const { baseDappAddress, wallet } = usePeepsContext();
  const rollups = useRollups(baseDappAddress);
  const [dp, setDp] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [bio, setBio] = useState<string>("");
  const [isSubmit, setIsSubmit] = useState<boolean>(false);
  const profileFormCloseButton = useRef(null);
  const [open, setOpen] = React.useState(false);

  const addInput = async (str: string) => {
    if (rollups) {
      try {
        let payload = ethers.utils.toUtf8Bytes(str);
        // if (hexInput) {
        //   payload = ethers.utils.arrayify(str);
        // }
        return await rollups.inputContract.addInput(
          defaultDappAddress,
          payload
        );
      } catch (e) {
        console.log(`${e}`);
      }
    }
  };

  const handleCreateProfile = async () => {
    setIsSubmit(true);
    // construct the json payload to send to addInput
    const jsonPayload = JSON.stringify({
      method: "createProfile",
      data: {
        username: username,
        bio: bio,
        profile_pic: dp,
      },
    });
    // addInput(JSON.stringify(jsonPayload));
    // console.log(JSON.stringify(jsonPayload));

    const res = await addInput(JSON.stringify(jsonPayload));
    console.log(res);
    const receipt = await res?.wait(1);
    console.log(receipt);
    const event = receipt?.events?.find((e) => e.event === "InputAdded");
    console.log(event);

    if (event) {
      setOpen(false);
    }

    toast.success("Profile created");
  };

  return (
    <AlertDialog.Root open={open} onOpenChange={setOpen}>
      <AlertDialog.Trigger asChild>
        <button
          type="button"
          className="btn btn-block inline-flex h-[35px] items-center justify-center px-[15px] font-medium leading-none outline-none outline-0"
          disabled={!wallet}
        >
          Create Profile
        </button>
      </AlertDialog.Trigger>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="bg-black/40 bg-blackA6 data-[state=open]:animate-overlayShow fixed inset-0 dark:bg-base-300/80 dark:backdrop-blur-sm z-30" />
        <AlertDialog.Content className="z-40 data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[500px] bg-base-100 translate-x-[-50%] translate-y-[-50%] rounded-[6px] p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none dark:bg-base-100">
          <AlertDialog.Title className="text-mauve12 mt-4 mb-12 text-xl text-center font-bold">
            Create your Profile
          </AlertDialog.Title>
          <AlertDialog.Description className="text-[15px] text-center leading-normal">
            {/* We require this to serve the best experience */}
            <div className="card items-center shrink-0 my-4 w-full bg-base-100">
              <AvatarProfile src={dp} />
              <label
                htmlFor={"id-avatar-dp"}
                title="Select dp"
                className="btn btn-sm mt-4"
              >
                <CameraIcon />
                Select display picture
                <input
                  type="file"
                  name=""
                  id="id-avatar-dp"
                  className="hidden"
                />
              </label>
              <form className="card-body w-full">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Username</span>
                  </label>
                  <input
                    type="username"
                    placeholder="username"
                    className="input input-bordered"
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">About yourself</span>
                  </label>
                  <textarea
                    className="textarea textarea-lg textarea-bordered text-base resize-none"
                    placeholder="Tell the world something about yourself"
                    onChange={(e) => setBio(e.target.value)}
                  ></textarea>
                </div>
                <div className="form-control mt-6">
                  <button
                    type="button"
                    className="btn btn-primary rounded-xl"
                    onClick={handleCreateProfile}
                  >
                    {isSubmit ? <ButtonLoader /> : "Create Profile"}
                  </button>
                </div>
              </form>
            </div>
          </AlertDialog.Description>
          <div className="absolute top-8 right-4 flex justify-end gap-[25px]">
            <AlertDialog.Cancel asChild>
              <button
                title="Close profile dialog"
                type="button"
                className="btn size-12 rounded-full text-xl"
                aria-label="Close"
                ref={profileFormCloseButton}
              >
                <Cross2Icon size={64} />
              </button>
            </AlertDialog.Cancel>
            {/* <AlertDialog.Action asChild>
            <button className="text-red11 bg-red4 hover:bg-red5 focus:shadow-red7 inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] font-medium leading-none outline-none focus:shadow-[0_0_0_2px]">
              Yes, delete account
            </button>
          </AlertDialog.Action> */}
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
};
