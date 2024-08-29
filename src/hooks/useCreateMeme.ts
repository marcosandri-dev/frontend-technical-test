import { useState } from "react";

import { Picture } from "../common/common";
import { MemePictureText } from "../api/types";

export const useCreateMeme = () => {
  const [picture, setPicture] = useState<Picture | null>(null);
  const [texts, setTexts] = useState<MemePictureText[]>([]);
  const [captionIndex, setCaptionIndex] = useState<number | null>(null);

  const updateCaption = (caption: string, i: number) => {
    const newText = { ...texts[i], content: caption };
    setTexts(texts.map((text, index) => (i === index ? newText : text)));
  };

  const handleDeleteCaptionButtonClick = (index: number) => {
    setCaptionIndex(null);
    setTexts(texts.filter((_, i) => i !== index));
  };

  return {
    picture,
    setPicture,
    texts,
    setTexts,
    captionIndex,
    setCaptionIndex,
    updateCaption,
    handleDeleteCaptionButtonClick,
  };
};
