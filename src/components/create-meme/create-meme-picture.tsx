import {
  Box,
  Button,
  Icon,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
} from "@chakra-ui/react";
import { Dispatch, SetStateAction } from "react";
import {
  MemePicture,
  MemePictureProps,
  REF_HEIGHT,
  REF_WIDTH,
} from "../meme-picture";
import { Pencil } from "@phosphor-icons/react";

interface CreateMemePictureProps {
  memePicture: MemePictureProps;
  open: () => void;
  setTexts: Dispatch<SetStateAction<MemePictureProps["texts"]>>;
  captionIndex: number | null;
}

const CreateMemePicture: React.FC<CreateMemePictureProps> = ({
  memePicture,
  open,
  setTexts,
  captionIndex,
}) => {
  const handleSlideChange = (slideValue: number, key: string) => {
    if (captionIndex !== null) {
      const newValues = {
        ...memePicture.texts[captionIndex],
        [key]: slideValue,
      };

      setTexts(
        memePicture.texts.map((text, index) =>
          captionIndex === index ? newValues : text
        )
      );
    }
  };

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
              height="100%"
              colorScheme="pink"
              onChange={(event) => handleSlideChange(event, "y")}
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
              onChange={(event) => handleSlideChange(event, "x")}
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
};

export default CreateMemePicture;
