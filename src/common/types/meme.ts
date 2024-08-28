import {
  GetMemeCommentsResponse,
  GetUserByIdResponse,
  MemeCommentResult,
} from "../../api/types";

// Types defined by API calls
export type MemeCardAuthorType = GetUserByIdResponse;
export type MemeCardCommentType = MemeCommentResult & {
  author: MemeCardAuthorType;
};

// Override for pagination system
export type MemeCardCommentPageType = Omit<
  GetMemeCommentsResponse,
  "results"
> & {
  results: MemeCardCommentType[];
};

// Type for the business logic of the Meme Card
export type MemeCardType = {
  id: string;
  authorId: string;
  pictureUrl: string;
  description: string;
  commentsCount: string;
  texts: {
    content: string;
    x: number;
    y: number;
  }[];
  author: MemeCardAuthorType;
  comments?: MemeCardCommentType[];
  createdAt: string;
};
