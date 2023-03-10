import { useEffect, useRef } from "react";

const usePrevious = (value) => {
  const ref = useRef();

  useEffect(() => {
    // eslint-disable-next-line no-return-assign
    return (ref.current = value);
  }, [value]);

  return ref.current;
};

export default usePrevious;
