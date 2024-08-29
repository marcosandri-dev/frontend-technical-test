import { Dispatch, SetStateAction } from "react";
import { useDropzone } from "react-dropzone";
import {
  MemePicture,
  MemePictureProps,
  REF_FONT_SIZE,
  REF_HEIGHT,
  REF_WIDTH,
} from "./meme-picture";
import {
  AspectRatio,
  Box,
  Button,
  Flex,
  Icon,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Text,
} from "@chakra-ui/react";
import { Image, Pencil } from "@phosphor-icons/react";

export type MemeEditorProps = {
  onDrop: (file: File) => void;
  memePicture?: MemePictureProps;
  captionIndex: number | null;
  setTexts: Dispatch<SetStateAction<MemePictureProps["texts"]>>;
};

function renderNoPicture() {
  return (
    <Flex
      flexDir="column"
      width="full"
      height="full"
      alignItems="center"
      justifyContent="center"
    >
      <Icon as={Image} color="black" boxSize={16} />
      <Text>Select a picture</Text>
      <Text color="gray.400" fontSize="sm">
        or drop it in this area
      </Text>
    </Flex>
  );
}

function renderMemePicture(
  memePicture: MemePictureProps,
  open: () => void,
  setTexts: Dispatch<SetStateAction<MemePictureProps["texts"]>>,
  captionIndex: number | null
) {
  return (
    <Box
      width="full"
      height="full"
      position="relative"
      __css={{
        "&:hover .change-picture-button": {
          display: "inline-block",
        },
        "& .change-picture-button": {
          display: "none",
        },
        "&:hover .slider-picture": {
          display: "inline-block",
        },
        "& .slider-picture": {
          display: "none",
        },
      }}
    >
      <MemePicture {...memePicture} />
      <Button
        className="change-picture-button"
        leftIcon={<Icon as={Pencil} boxSize={4} />}
        colorScheme="cyan"
        color="white"
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
        position="absolute"
        onClick={open}
      >
        Change picture
      </Button>
      {captionIndex !== null && (
        <>
          <Box position="absolute" top="5%" left="2%" height="89%">
            <Slider
              className="slider-picture"
              value={memePicture.texts[captionIndex].y}
              orientation="vertical"
              isReversed
              height="100%" // Make the slider fill the height of its parent box
              colorScheme="pink"
              onChange={(event) =>
                setTexts(
                  memePicture.texts.map((text, index) =>
                    captionIndex === index
                      ? { ...memePicture.texts[captionIndex], y: event }
                      : text
                  )
                )
              }
              max={REF_HEIGHT}
              min={0}
            >
              <SliderTrack>
                <SliderFilledTrack />
              </SliderTrack>
              <SliderThumb />
            </Slider>
          </Box>
          <Box position="absolute" top="92%" left="5%" width="90%">
            <Slider
              className="slider-picture"
              value={memePicture.texts[captionIndex].x}
              position="absolute"
              colorScheme="blue"
              onChange={(event) =>
                setTexts(
                  memePicture.texts.map((text, index) =>
                    captionIndex === index
                      ? { ...memePicture.texts[captionIndex], x: event }
                      : text
                  )
                )
              }
              max={REF_WIDTH}
              min={0}
            >
              <SliderTrack>
                <SliderFilledTrack />
              </SliderTrack>
              <SliderThumb />
            </Slider>
          </Box>
        </>
      )}
    </Box>
  );
}

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
        {memePicture
          ? renderMemePicture(memePicture, open, setTexts, captionIndex)
          : renderNoPicture()}
      </Box>
    </AspectRatio>
  );
};
