import { useState } from "react";

import { CaretDown, CaretUp, Chat } from "@phosphor-icons/react";

import { useInfiniteQuery } from "@tanstack/react-query";

import { useAuthToken } from "../../contexts/authentication";

import {
  Collapse,
  Box,
  Flex,
  Icon,
  LinkBox,
  LinkOverlay,
  Text,
  Button,
} from "@chakra-ui/react";

import { fetchComments } from "../../api/meme.service";
import MemeCardCommentsSection from "./meme-card-comments-section";
import { Loader } from "../loader";
import MemeCardInputForm from "./meme-card-input-form";

interface MemeCardFooterProps {
  memeId: string;
  commentsCount: string;
}

// Needs more refactor.
const MemeCardFooter: React.FC<MemeCardFooterProps> = ({
  memeId,
  commentsCount,
}) => {
  const token = useAuthToken();

  const [openedCommentSection, setOpenedCommentSection] = useState<
    string | null
  >(null);

  // Not having a totalComments returned by posting a new comment, we need to keep track of it manually.
  const [totalComments, settotalComments] = useState<number>(
    parseInt(commentsCount)
  );

  const {
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    data: commentPagesArray,
  } = useInfiniteQuery({
    queryFn: async ({ pageParam = 1 }) =>
      fetchComments(token, memeId, pageParam),
    queryKey: ["comments", memeId],
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) => {
      return Math.ceil(lastPage.total / lastPage.pageSize) > pages.length
        ? pages.length + 1
        : undefined;
    },
    refetchOnWindowFocus: false,
    enabled: false,
  });

  const loadComments = async () => {
    if (!openedCommentSection) {
      fetchNextPage();
    }
    setOpenedCommentSection(openedCommentSection === memeId ? null : memeId);
  };

  return (
    <>
      <LinkBox as={Box} py={2} borderBottom="1px solid black">
        <Flex justifyContent="space-between" alignItems="center">
          <Flex alignItems="center">
            <LinkOverlay
              data-testid={`meme-comments-section-${memeId}`}
              cursor="pointer"
              onClick={() => loadComments()}
            >
              <Text data-testid={`meme-comments-count-${memeId}`}>
                {totalComments} comments
              </Text>
            </LinkOverlay>
            <Icon
              as={openedCommentSection !== memeId ? CaretDown : CaretUp}
              ml={2}
              mt={1}
            />
          </Flex>
          <Icon as={Chat} />
        </Flex>
      </LinkBox>
      <Collapse in={openedCommentSection === memeId} animateOpacity>
        {isFetchingNextPage ? (
          <Loader data-testid="meme-comments-loader" />
        ) : (
          <>
            <MemeCardInputForm
              setNewComments={settotalComments}
              memeId={memeId}
            />
            <MemeCardCommentsSection
              memeId={memeId}
              commentsList={commentPagesArray?.pages.flatMap((commentPages) =>
                commentPages.results.map((comment) => comment)
              )}
            />
            <Flex justifyContent="center" mt={4}>
              {hasNextPage && !isFetchingNextPage && (
                <Button mb={2} onClick={() => fetchNextPage()}>
                  Load More
                </Button>
              )}
            </Flex>
          </>
        )}
      </Collapse>
    </>
  );
};

export default MemeCardFooter;
