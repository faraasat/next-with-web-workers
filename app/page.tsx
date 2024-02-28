"use client";

import { useEffect, useState } from "react";

import useWorker from "@/hooks/useWorker";
import { PostsWithFilters } from "@/components/posts-with-filters";

import { IFetchPosts, actionT, sortKeyT } from "@/types";

function sortFunction(this: any) {
  self.onmessage = async (e: any) => {
    const { sortKey, posts } = e.data;
    const [action] = (sortKey as sortKeyT)?.split(":");

    const sortLogic = function () {
      switch ((sortKey as sortKeyT)?.split(":")[1] || "") {
        case "ASC":
          return (posts as Array<IFetchPosts>).sort((a, b) =>
            a[action.toLowerCase() as actionT]
              .toString()
              .localeCompare(b[action.toLowerCase() as actionT].toString())
          );
        case "DESC":
          return (posts as Array<IFetchPosts>).sort((a, b) =>
            b[action.toLowerCase() as actionT]
              .toString()
              .localeCompare(a[action.toLowerCase() as actionT].toString())
          );
        default:
          return posts as Array<IFetchPosts>;
      }
    };

    self.postMessage(sortLogic());
  };
}

export default function Home() {
  const [sortKey, setSortKey] = useState<sortKeyT>("");
  const [index, setIndex] = useState<number | null>(null);
  const [initialLoading, setInitialLoading] = useState<boolean>(false);
  const [posts, setPosts] = useState<Array<IFetchPosts>>([]);
  const { loading, result, error } = useWorker(sortFunction, sortKey, posts);

  useEffect(() => {
    setInitialLoading(true);
    const worker = new Worker(
      new URL("../services/posts2.ts", import.meta.url)
    );

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
