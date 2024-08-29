import { Dispatch, SetStateAction } from "react";
import { useDropzone } from "react-dropzone";
import { MemePictureProps } from "../meme-picture";
import { AspectRatio, Box } from "@chakra-ui/react";
import NoPicture from "./no-picture";
import CreateMemePicture from "./create-meme-picture";
import { MemePictureText } from "../../api/types";

export type MemeEditorProps = {
  onDrop: (file: File) => void;
  memePicture?: MemePictureProps;
  captionIndex: number | null;
  setTexts: Dispatch<SetStateAction<MemePictureText[]>>;
};

export const MemeEditor: React.FC<MemeEditorProps> = ({
  onDrop,
  memePicture,
  captionIndex,
  setTexts,
}) => {
  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop: (files: File[]) => {
      if (files.length === 0) {
        return;
      }
      onDrop(files[0]);
    },
    noClick: memePicture !== undefined,
    accept: { "image/png": [".png"], "image/jpg": [".jpg"] },
  });

  return (
    <AspectRatio ratio={16 / 9}>
      <Box
        {...getRootProps()}
        width="full"
        position="relative"
        border={!memePicture ? "1px dashed" : undefined}
        borderColor="gray.300"
        borderRadius={9}
        px={1}
      >
        <input {...getInputProps()} />
        {memePicture ? (
          <CreateMemePicture
            memePicture={memePicture}
            open={open}
            setTexts={setTexts}
            captionIndex={captionIndex}
          />
        ) : (
          <NoPicture />
        )}
      </Box>
    </AspectRatio>
  );
};
