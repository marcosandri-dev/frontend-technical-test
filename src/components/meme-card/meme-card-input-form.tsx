import React, { Dispatch, SetStateAction, useState } from "react";
import { Box, Flex, Avatar, Input } from "@chakra-ui/react";
import {
  InfiniteData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { createMemeComment, getUserById } from "../../api/api";
import { useAuthToken } from "../../contexts/authentication";
import { jwtDecode } from "jwt-decode";
import { MemeCardCommentPageType } from "../../common/types/meme";
import { addAuthorToComment } from "../../api/meme.service";

interface MemeCardInputFormProps {
  setNewComments: Dispatch<SetStateAction<number>>;
  memeId: string;
}

const MemeCardInputForm: React.FC<MemeCardInputFormProps> = ({
  setNewComments,
  memeId,
}) => {
  const token = useAuthToken();
  const queryClient = useQueryClient();

  const [commentContent, setCommentContent] = useState<string>("");

  const { data: user } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      return await getUserById(token, jwtDecode<{ id: string }>(token).id);
    },
  });

  // Adds a comment
  const { mutate } = useMutation({
    mutationFn: async (data: { memeId: string; content: string }) => {
      return await createMemeComment(token, data.memeId, data.content);
    },
    onSuccess: async (newComment) => {
      // User is not a good single source of truth.
      const newCommentWithUser = await addAuthorToComment(token, newComment);

      // We need to update our data, by putting the comment on top of the first page.
      queryClient.setQueryData(
        ["comments", memeId],
        (oldData: InfiniteData<MemeCardCommentPageType>) => {
          // Updates the first page with the new comment with immutability
          const updatedFirstPage = {
            ...oldData.pages[0],
            results: [newCommentWithUser, ...oldData.pages[0].results],
          };

          // Returns the pages and infiniteQuery structure with the updated one at the top
          return {
            ...oldData,
            pages: [updatedFirstPage, ...oldData.pages.slice(1)],
          };
        }
      );

      setNewComments((oldComments: number) => oldComments + 1);
      setCommentContent("");
    },
  });

  return (
    <Box mb={6}>
      <form
        data-testid={`comment-form-${memeId}`}
        onSubmit={(event) => {
          event.preventDefault();
          if (commentContent) {
            mutate({
              memeId,
              content: commentContent,
            });
          }
        }}
      >
        <Flex alignItems="center">
          <Avatar
            borderWidth="1px"
            borderColor="gray.300"
            name={user?.username}
            src={user?.pictureUrl}
            size="sm"
            mr={2}
          />
          <Input
            data-testid={`comment-input-${memeId}`}
            placeholder="Type your comment here..."
            onChange={(event) => {
              setCommentContent(event.target.value);
            }}
            value={commentContent}
          />
        </Flex>
      </form>
    </Box>
  );
};

export default MemeCardInputForm;
