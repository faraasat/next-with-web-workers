"use client";

import { Suspense, useCallback, useEffect, useState } from "react";

import { fetchPosts } from "@/services/posts";
import { PostsWithFilters } from "@/components/posts-with-filters";

import { IFetchPosts, actionT, sortKeyT } from "@/types";

async function sortFunction(
  this: any,
  sortKey: sortKeyT,
  posts: Array<IFetchPosts>
) {
  const [action, type] = sortKey.split(":");

  switch (type ? type : "") {
    case "ASC":
      return posts.sort((a, b) =>
        a[action.toLowerCase() as actionT]
          .toString()
          .localeCompare(b[action.toLowerCase() as actionT].toString())
      );
    case "DESC":
      return posts.sort((a, b) =>
        b[action.toLowerCase() as actionT]
          .toString()
          .localeCompare(a[action.toLowerCase() as actionT].toString())
      );
    default:
      return posts;
  }
}

export default function Home() {
  const [sortKey, setSortKey] = useState<sortKeyT>("");
  const [index, setIndex] = useState<number | null>(null);
  const [posts, setPosts] = useState<Array<IFetchPosts>>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const p = await fetchPosts();
      const res = await sortFunction(sortKey, p);
      setPosts(res);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [sortKey]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <Suspense fallback={<>Loading</>}>
      <PostsWithFilters
        index={index}
        loading={loading}
        posts={posts}
        setIndex={setIndex}
        setSortKey={setSortKey}
        initialLoading={loading}
      />
    </Suspense>
  );
}
