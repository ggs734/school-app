import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";

import { api } from "~/trpc/react";

import { Button } from "~/shadcn/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/shadcn/ui/dialog";

export default function DialogDemo() {
  const [isOpen, setIsOpen] = useState(false);
  const [musicUrl, setMusicUrl] = useState<string>("");
  const [videoInfo, setVideoInfo] = useState<
    { musicTitle: string; musicImage: string } | undefined
  >();
  const utils = api.useUtils();

  const getVideoInfoMutation = api.radioCenter.getVideoInfo.useMutation({
    onSuccess: (data) => {
      setVideoInfo(data);
    },
    onError: () => {
      setVideoInfo(undefined);
    },
  });

  const createOrderMutation = api.radioCenter.createOrder.useMutation({
    onSuccess: () => {
      void utils.radioCenter.getOrders.invalidate();
      setIsOpen(false);
    },

    onError: (error) => {
      error.data?.zodError
        ? toast.error(error.data.zodError[0]?.message)
        : toast.error(error.message);
    },
  });

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const regExp =
      /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const videoId = e.target.value.replace(regExp, "$2");
    setMusicUrl(e.target.value);

    console.log(
      e.target.value.split(
        /^.*(?:(?:youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*))?.*/,
      ),
    );

    if (regExp.test(e.target.value) && videoId.length >= 11) {
      getVideoInfoMutation.mutate(e.target.value);
    } else {
      videoInfo && setVideoInfo(undefined);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Замовити</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Створити замовлення</DialogTitle>
          <DialogDescription>Посилання на відео:</DialogDescription>
        </DialogHeader>
        <div>
          <input
            type="text"
            className="w-full rounded-lg border border-[#3d3d3d] bg-card px-3 py-2 outline-none placeholder:text-[#8f8f8f]"
            placeholder="Посилання на відео"
            value={musicUrl}
            onChange={handleInputChange}
          />

          {getVideoInfoMutation.isPending && (
            <Loader2 className="mx-auto mt-3 h-5 w-5 animate-spin text-[#b5b5b5]" />
          )}

          {getVideoInfoMutation.isError && (
            <div className="mt-3 text-sm text-red-500 text-center">
              {getVideoInfoMutation.error.message}
            </div>
          )}

          {videoInfo &&
            !getVideoInfoMutation.isPending &&
            !getVideoInfoMutation.isError && (
              <div className=" mt-6 pt-4 border-t-2 gap-4 border-[#3a3a3a] flex items-center max-[415px]:flex-col">
                <Image
                  className="rounded-lg"
                  width={125}
                  height={100}
                  src={videoInfo.musicImage ?? ""}
                  alt="music image"
                />

                <span className="max-w-[250px]">
                  {videoInfo.musicTitle.length > 55
                    ? videoInfo.musicTitle?.slice(0, 55) + "..."
                    : videoInfo.musicTitle}
                </span>
              </div>
            )}
        </div>
        <DialogFooter className="justify-end">
          <Button
            type="submit"
            disabled={
              !musicUrl ||
              !videoInfo ||
              createOrderMutation.isPending ||
              getVideoInfoMutation.isPending
            }
            onClick={() =>
              createOrderMutation.mutate({
                musicUrl,
                musicImage: videoInfo?.musicImage ?? "",
                musicTitle: videoInfo?.musicTitle ?? "",
              })
            }
          >
            Замовити
            {createOrderMutation.isPending && (
              <Loader2 className="ml-2 h-4 w-4 animate-spin" />
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}