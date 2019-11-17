import { useState } from "react";

import useInterval from "./useInterval";

export default (): Date => {
  const [now, setNow] = useState(new Date());

  useInterval(() => {
    setNow(new Date());
  }, 1000 * 60);

  return now;
};
