// hooks/useWorker.tsx

"use client";

import { useCallback, useEffect, useState } from "react";

import { IFetchPosts, sortKeyT } from "@/types";

/**
 * @dev This hook is used to run a custom function in a web worker.
 * @param workerFunction function you want to run in a web worker
 * @returns {boolean, any, unknown} loading: boolean, result: any, error: unknown
 */
const useWorker = (
  workerFunction: Function,
  sortKey: sortKeyT,
  posts: Array<IFetchPosts>
) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<unknown | null>(null);

  // caching the worker function
  const workerFunctionCb = useCallback(workerFunction, [workerFunction]);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        // stringifying the function, creating a
        // blob and creating a url for the blob
        const stringifiedFunction = workerFunctionCb.toString();
        const blob = new Blob([`(${stringifiedFunction})()`], {
          type: "application/javascript",
        });
        const scriptUrl = URL.createObjectURL(blob);

        // initializing our worker
        const worker = new Worker(scriptUrl);

        // set the result when our function is done
        worker.onmessage = (e) => {
          setResult(e.data);
          setLoading(false);
          setError(null);
        };

        // set the error if our function throws an error
        worker.onerror = (e) => {
          setResult(null);
          setError(e.message);
          setLoading(false);
        };

        // sending message to the worker
        worker.postMessage({
          sortKey,
          posts,
        });

        // terminating worker on unmount
        return () => {
          worker.terminate();
          URL.revokeObjectURL(scriptUrl);
          setLoading(false);
        };
      } catch (err) {
        console.log(err);
        setLoading(false);
        setError(err);
      }
    })();
  }, [workerFunctionCb, sortKey, posts]);

  return { loading, result, error };
};

export default useWorker;
