// app/page.tsx

"use client";

import { useEffect, useState } from "react";

import useWorker from "@/hooks/useWorker";
import { PostsWithFilters } from "@/components/posts-with-filters";

import { IFetchPosts, actionT, sortKeyT } from "@/types";

/**
 * @dev this function would be called in the web worker
 */
function sortFunction() {
  self.onmessage = async (e: any) => {
    // we are getting sortKey and posts from worker thread
    const { sortKey, posts } = e.data;
    const [action] = (sortKey as sortKeyT)?.split(":");

    const sortLogic = function () {
      switch ((sortKey as sortKeyT)?.split(":")[1] || "") {
        case "ASC":
          return [...posts].sort((a, b) =>
            a[action.toLowerCase() as actionT]
              .toString()
              .localeCompare(b[action.toLowerCase() as actionT].toString())
          );
        case "DESC":
          return [...posts].sort((a, b) =>
            b[action.toLowerCase() as actionT]
              .toString()
              .localeCompare(a[action.toLowerCase() as actionT].toString())
          );
        default:
          // return posts as it is if no sortKey is provided
          return [...posts];
      }
    };

    // we will send back our sorted posts to main thread (hook)
    self.postMessage(sortLogic());
  };
}

export default function Home() {
  const [sortKey, setSortKey] = useState<sortKeyT>(""); // keeps track of sortKey
  const [index, setIndex] = useState<number | null>(null); // keeps track of index of tabs (just for UI purpose)
  const [posts, setPosts] = useState<Array<IFetchPosts>>([]); // keeps track of posts
  const [initialLoading, setInitialLoading] = useState<boolean>(false); // keeps track of loading state
  const { loading, result, error } = useWorker(sortFunction, sortKey, posts); // our Web Worker Hook

  // fetch data on initial load
  useEffect(() => {
    setInitialLoading(true);
    // directly using our file in web worker to fetch posts
    const worker = new Worker(
      new URL("../services/posts2.ts", import.meta.url)
    );

    // updating our state on receiving message from worker
    worker.onmessage = (e) => {
      setInitialLoading(false);
      setPosts(e.data);
    };
  }, []);

  return (
    <PostsWithFilters
      index={index}
      loading={loading}
      posts={result || []}
      setIndex={setIndex}
      setSortKey={setSortKey}
      initialLoading={initialLoading}
      showUIStuck={false}
    />
  );
}
