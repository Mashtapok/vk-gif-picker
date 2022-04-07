import React from "react";
import { Icon } from "./Icon";

type Props = {
  className?: string;
};

export const IconSelected: React.FC<Props> = ({ className }) => {
  return (
    <Icon width={16} height={16} className={className}>
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M8 15A7 7 0 118 1a7 7 0 010 14zM6 7.94a.75.75 0 10-1 1.12l1.46 1.3c.44.38 1.1.33 1.49-.1l.04-.05 2.9-3.75a.75.75 0 10-1.19-.92L7.1 8.91 6 7.94z"
      ></path>
    </Icon>
  );
};
