import { AppContext } from "@root/contexts";
import { useContext, useEffect, useRef } from "react";

const useAppContextWithRef = (contextName) => {
  const { appContext, setAppContext } = useContext(AppContext);
  console.log("useAppContext", contextName, appContext);
  appContext[contextName] = appContext[contextName] || {};
  const appContextRef = useRef(appContext[contextName]);

  const customSetAppContext = (newValue) => {
    setAppContext((prevContext) => {
      console.log("useAppContext prevContext", contextName, prevContext);
      const newContext = {
        ...prevContext,
        [contextName]:
          typeof newValue === "function" ? newValue(prevContext[contextName]) : newValue,
      };
      console.log("useAppContext returning", contextName, newContext[contextName]);
      return newContext;
    });
  };

  useEffect(() => {
    appContextRef.current = appContext[contextName];
  }, [appContext[contextName]]);

  return [appContextRef.current, customSetAppContext];
};

const useAppContextWithContext = (contextName) => {
  const { appContext, setAppContext } = useContext(AppContext);
  appContext[contextName] = appContext[contextName] || {};

  const customSetAppContext = (newValue) => {
    setAppContext((prevContext) => {
      console.log("useAppContext prevContext", contextName, prevContext);
      const newContext = {
        ...prevContext,
        [contextName]:
          typeof newValue === "function" ? newValue(prevContext[contextName]) : newValue,
      };
      console.log("useAppContext returning", contextName, newContext[contextName]);
      return newContext;
    });
  };

  return [appContext[contextName], customSetAppContext];
};

const useAppContextRaw = (contextName) => {
  const { appContext, setAppContext } = useContext(AppContext);
  appContext[contextName] = appContext[contextName] || {};

  const setSpecificContext = (newValue) => {
    setAppContext((prevContext) => {
      return {
        ...prevContext,
        [contextName]:
          typeof newValue === "function" ? newValue(prevContext[contextName]) : newValue,
      };
    });
  };

  return [appContext[contextName], setSpecificContext];
};

const useAppContextWithContextWithInitialState = (contextName, initialState) => {
  const { appContext, setAppContext } = useContext(AppContext);
  appContext[contextName] = appContext[contextName] || initialState;

  const customSetAppContext = (newValue) => {
    setAppContext((prevContext) => {
      // console.log("useAppContext prevContext", contextName, prevContext);
      const newContext = {
        ...prevContext,
        [contextName]:
          typeof newValue === "function" ? newValue(prevContext[contextName]) : newValue,
      };
      // console.log("useAppContext returning", contextName, newContext[contextName]);
      return newContext;
    });
  };

  // if (!appContext[contextName]) customSetAppContext(initialState);

  return [appContext[contextName], customSetAppContext];
};

export const useAppContext = (contextName, initialState = {}) => {
  return useAppContextWithContextWithInitialState(contextName, initialState);
};
