// app/page.tsx

"use client";

import { useCallback, useEffect, useState } from "react";

import { fetchPosts } from "@/services/posts";
import { PostsWithFilters } from "@/components/posts-with-filters";

import { IFetchPosts, actionT, sortKeyT } from "@/types";

/**
 * @dev performs the sorting of posts based on parameters
 * @param {sortKeyT} sortKey to distinguish which operation to perform - ASC or DESC and on what property - title, author, date
 * @param {IFetchPosts} posts list of posts
 * @returns {IFetchPosts} update list of posts
 */
async function sortFunction(sortKey: sortKeyT, posts: Array<IFetchPosts>) {
  // splitting our sortKey to get the action ("date" | "title" | "author") and type ("ASC" | "DESC")
  const [action, type] = sortKey.split(":");

  // apply filtering based on our action and type
  switch (type ? type : "") {
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
}

export default function Home() {
  const [sortKey, setSortKey] = useState<sortKeyT>(""); // keeps track of sortKey
  const [index, setIndex] = useState<number | null>(null); // keeps track of index of tabs (just for UI purpose)
  const [posts, setPosts] = useState<Array<IFetchPosts>>([]); // keeps track of posts
  const [loading, setLoading] = useState<boolean>(false); // keeps track of loading state

  // loads the posts and applies sorting based on sortKey
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

  // calls the loadData function on initial render
  useEffect(() => {
    loadData();
  }, [loadData, sortKey]);

  return (
    <PostsWithFilters
      index={index}
      loading={loading}
      posts={posts}
      setIndex={setIndex}
      setSortKey={setSortKey}
      initialLoading={loading}
    />
  );
}
