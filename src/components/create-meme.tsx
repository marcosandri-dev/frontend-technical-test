import { useMemo, useState } from "react";

import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Icon,
  IconButton,
  Input,
  Textarea,
  VStack,
} from "@chakra-ui/react";

import { Link, useNavigate } from "@tanstack/react-router";
import { Plus, Trash } from "@phosphor-icons/react";
import { useMutation } from "@tanstack/react-query";

import { Picture } from "../common/common";
import { MemePictureText } from "../api/types";
import { useAuthToken } from "../contexts/authentication";
import { postMeme } from "../api/meme.service";
import { MemeEditor } from "./meme-editor";

interface CreateMemePageProps {}

const CreateMemePage: React.FC<CreateMemePageProps> = () => {
  const token = useAuthToken();
  const navigate = useNavigate();

  const [picture, setPicture] = useState<Picture | null>(null);
  const [texts, setTexts] = useState<MemePictureText[]>([]);
  const [captionIndex, setCaptionIndex] = useState<number | null>(null);
  const [description, setDescription] = useState<string>("");

  const handleDrop = (file: File) => {
    setPicture({
      url: URL.createObjectURL(file),
      file,
    });
  };

  const handleAddCaptionButtonClick = () => {
    setTexts([
      ...texts,
      {
        content: `New caption ${texts.length + 1}`,
        x: Math.trunc(Math.random() * 400),
        y: Math.trunc(Math.random() * 225),
      },
    ]);
  };

  const updateCaption = (caption: string, i: number) => {
    const newText = { ...texts[i], content: caption };
    setTexts(texts.map((text, index) => (i === index ? newText : text)));
  };

  const handleDeleteCaptionButtonClick = (index: number) => {
    setCaptionIndex(null);
    setTexts(texts.filter((_, i) => i !== index));
  };

  const { mutate } = useMutation({
    mutationFn: async () => {
      console.log("mutation", token, picture, description, texts);
      if (picture) {
        return await postMeme(token, picture.file, description, texts);
      }
    },
    onSuccess: async () => {
      navigate({ to: "/" });
    },
  });

  const memePicture = useMemo(() => {
    if (!picture) {
      return undefined;
    }
    return {
      pictureUrl: picture.url,
      texts,
    };
  }, [picture, texts]);

  return (
    <Flex width="full" height="full">
      <Box flexGrow={1} height="full" p={4} overflowY="auto">
        <VStack spacing={5} align="stretch">
          <Box>
            <Heading as="h2" size="md" mb={2}>
              Upload your picture
            </Heading>
            <MemeEditor
              onDrop={handleDrop}
              memePicture={memePicture}
              captionIndex={captionIndex}
              setTexts={setTexts}
            />
          </Box>
          <Box>
            <Heading as="h2" size="md" mb={2}>
              Describe your meme
            </Heading>
            <Textarea
              placeholder="Type your description here..."
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
          </Box>
        </VStack>
      </Box>
      <Flex
        flexDir="column"
        width="30%"
        minW="250"
        height="full"
        boxShadow="lg"
      >
        <Heading as="h2" size="md" mb={2} p={4}>
          Add your captions
        </Heading>
        <Box p={4} flexGrow={1} height={0} overflowY="auto">
          <VStack>
            {texts.map((text, index) => (
              <Flex width="full" key={index}>
                <Input
                  onChange={(event) => updateCaption(event.target.value, index)}
                  onFocus={() => setCaptionIndex(index)}
                  value={text.content}
                  mr={1}
                />
                <IconButton
                  onClick={() => handleDeleteCaptionButtonClick(index)}
                  aria-label="Delete caption"
                  icon={<Icon as={Trash} />}
                />
              </Flex>
            ))}
            <Button
              colorScheme="cyan"
              leftIcon={<Icon as={Plus} />}
              variant="ghost"
              size="sm"
              width="full"
              onClick={handleAddCaptionButtonClick}
              isDisabled={memePicture === undefined}
            >
              Add a caption
            </Button>
          </VStack>
        </Box>
        <HStack p={4}>
          <Button
            as={Link}
            to="/"
            colorScheme="cyan"
            variant="outline"
            size="sm"
            width="full"
          >
            Cancel
          </Button>
          <Button
            colorScheme="cyan"
            size="sm"
            width="full"
            color="white"
            isDisabled={memePicture === undefined}
            onClick={() => mutate()}
          >
            Submit
          </Button>
        </HStack>
      </Flex>
    </Flex>
  );
};

export default CreateMemePage;
