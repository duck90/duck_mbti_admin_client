import { useRef, useEffect } from "react";

const usePrevState = (state: any) => {
  const ref = useRef();

  useEffect(() => {
    ref.current = state;
  });

  return ref.current;
};

export default usePrevState;
