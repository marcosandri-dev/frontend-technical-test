import {
  MemeCardCommentPageType,
  MemeCardCommentType,
  MemeCardType,
} from "../common/types/meme";
import { getUserById, getMemeComments, getMemes } from "./api";
import { MemeCommentResult, MemeResult } from "./types";

export async function addAuthorToComment(
  token: string,
  comment: MemeCommentResult
): Promise<MemeCardCommentType> {
  const author = await getUserById(token, comment.authorId);
  return { ...comment, author };
}

// Fetch comments on click.
export async function fetchComments(
  token: string,
  memeId: string,
  page: number
): Promise<MemeCardCommentPageType> {
  const commentPage = await getMemeComments(token, memeId, page);

  // Deals with concurrent calls while addind the author to all comments
  const promiseMeComments: Promise<MemeCardCommentType>[] =
    commentPage.results.map(async (comment) => {
      return await addAuthorToComment(token, comment);
    });
  const commentsWithAuthor: MemeCardCommentType[] =
    await Promise.all(promiseMeComments);

  return { ...commentPage, results: commentsWithAuthor };
}

async function completeMemeData(token: string, meme: MemeResult) {
  // Author of the meme
  const author = await getUserById(token, meme.authorId);

  return {
    ...meme,
    author,
    comments: [],
  };
}

export async function getMemesService(token: string, page: number = 1) {
  const memePage = await getMemes(token, page);

  // Deals with concurrent calls while addind the author to all memes
  const promiseMeMemes = memePage.results.map((meme) =>
    completeMemeData(token, meme)
  );
  const memesWithAuthorAndComments: MemeCardType[] =
    await Promise.all(promiseMeMemes);

  memePage.results.push(...memesWithAuthorAndComments);

  return { ...memePage, results: memesWithAuthorAndComments };
}
