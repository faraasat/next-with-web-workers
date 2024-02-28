// types/index.d.ts

import { Dispatch, SetStateAction } from "react";

export type actionT = "date" | "title" | "author";

export type sortKeyT =
  | ""
  | "DATE:ASC"
  | "DATE:DESC"
  | "AUTHOR:ASC"
  | "AUTHOR:DESC"
  | "TITLE:ASC"
  | "TITLE:DESC";

export type scriptListT = Array<{ title: string; sortKey: sortKeyT }>;

export interface IFetchPosts {
  id: string;
  title: string;
  body: string;
  image: string;
  email: string;
  author: string;
  date: Date;
  commentCount: number;
  avatar: string;
}

export interface IPostsWithFilters {
  index: number | null;
  loading: boolean;
  setIndex: Dispatch<SetStateAction<number | null>>;
  setSortKey: Dispatch<SetStateAction<sortKeyT>>;
  posts: Array<IFetchPosts>;
  initialLoading: boolean;
  showUIStuck?: boolean;
}
