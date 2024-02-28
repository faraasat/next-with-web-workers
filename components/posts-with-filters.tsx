// components/posts-with-filters.tsx

"use client";

import { Dispatch, SetStateAction } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";

import { IFetchPosts, scriptListT, sortKeyT } from "@/types";

const Timer = dynamic(() => import("./timer"), { ssr: false });

const scriptList: scriptListT = [
  {
    title: "Sort by Date (ASC)",
    sortKey: "DATE:ASC",
  },
  {
    title: "Sort by Date (DESC)",
    sortKey: "DATE:DESC",
  },
  {
    title: "Sort by Author Name (ASC)",
    sortKey: "AUTHOR:ASC",
  },
  {
    title: "Sort by Author Name (DESC)",
    sortKey: "AUTHOR:DESC",
  },
  {
    title: "Sort by Post Title (ASC)",
    sortKey: "TITLE:ASC",
  },
  {
    title: "Sort by Post Title (DESC)",
    sortKey: "TITLE:DESC",
  },
];

export const PostsWithFilters = ({
  index,
  loading,
  setIndex,
  setSortKey,
  posts,
  initialLoading,
  showUIStuck = true,
}: {
  index: number | null;
  loading: boolean;
  setIndex: Dispatch<SetStateAction<number | null>>;
  setSortKey: Dispatch<SetStateAction<sortKeyT>>;
  posts: Array<IFetchPosts>;
  initialLoading: boolean;
  showUIStuck?: boolean;
}) => {
  return (
    <div className="flex flex-col gap-10">
      <div className="mt-12">
        <Timer />
      </div>
      <div className="flex items-center justify-start gap-3 px-8 pt-1 pb-8">
        {scriptList.map((sl, i) => {
          return (
            <button
              key={i}
              className={`px-6 py-4 rounded-lg border cursor-pointer transition-all ${
                index === i
                  ? "border-indigo-300 text-indigo-300 hover:border-indigo-500 hover:text-indigo-500"
                  : "border-[transparent] text-white bg-indigo-300 hover:bg-indigo-500"
              }`}
              disabled={loading}
              onClick={() => {
                setIndex(i);
                setSortKey(sl.sortKey);
              }}
            >
              {sl.title}
            </button>
          );
        })}
      </div>
      <div className="flex items-center justify-center w-full h-auto">
        <div className="flex flex-col items-center justify-center max-w-[850px] w-full gap-3">
          {showUIStuck && posts.length === 0 && (
            <div className="text-[50px] text-red-800 h-[350px] font-bold">
              UI is Stuck!!!
            </div>
          )}
          {initialLoading || loading ? (
            <div className="flex items-center justify-center h-[calc(100vh-400px)] min-h-[200px]">
              <p className="text-2xl font-bold">Loading...</p>
            </div>
          ) : (
            <>
              {posts.map((p, i) => {
                return (
                  <div
                    key={i}
                    className="flex flex-col w-full rounded-lg px-6 py-7 bg-[#fff8e6] gap-3 cursor-pointer hover:scale-[1.02] transition-all"
                  >
                    <div className="font-bold text-gray-600">#{p.id}</div>
                    <div className="flex items-start justify-start gap-4 w-full">
                      <div className="relative flex items-center justify-center w-[130px] aspect-square h-auto rounded-lg">
                        <Image
                          src={p.image}
                          alt={p.title}
                          fill
                          draggable={false}
                          className="rounded-lg"
                          sizes="130px"
                        />
                      </div>
                      <div className="flex flex-col w-full items-start justify-center h-full">
                        <h1 className="text-[24px] leading-[1] font-bold">
                          {p.title}
                        </h1>
                        <p className="leading-[1] mt-[15px]">{p.body}</p>
                      </div>
                    </div>
                    <div className="flex mt-3 items-center justify-between">
                      <div>Dated: {p.date.toString()}</div>
                      <div>Comments: {p.commentCount}</div>
                    </div>
                    <div className="flex mt-14 items-center gap-3">
                      <div className="relative flex items-center justify-center w-[60px] aspect-square h-auto rounded-full">
                        <Image
                          src={p.avatar}
                          alt={p.title}
                          fill
                          draggable={false}
                          className="rounded-full"
                          sizes="60px"
                        />
                      </div>
                      <div className="flex flex-col">
                        <h3 className="text-[18px] text-gray-600 font-bold leading-[1]">
                          @{p.author}
                        </h3>
                        <p>{p.email}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
