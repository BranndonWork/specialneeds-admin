import { AppContext } from "@root/contexts";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import ContentLoading from "../Shared/ContentLoading";

function RouterLoading({ children }) {
  const { showRouterLoading } = useContext(AppContext);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleStart = (url, { shallow }) => {
      if (!shallow) {
        setLoading(true);
        document.body.classList.add("no-scroll");
      }
    };
    const handleComplete = () => {
      setLoading(false);
      document.body.classList.remove("no-scroll");
    };

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleComplete);
      document.body.classList.remove("no-scroll");
    };
  }, [router]);

  useEffect(() => {
    setLoading(showRouterLoading);
  }, [showRouterLoading]);

  return (
    <>
      <div id="router-loading" className={loading ? "loading" : ""}>
        <ContentLoading />
      </div>
      {children}
    </>
  );
}

export default RouterLoading;
