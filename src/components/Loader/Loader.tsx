import React, { FC } from "react";
import "./Loader.css";

type Props = {
  visible: boolean;
};

export const Loader: FC<Props> = ({ visible }) => {
  if (!visible) return null;

  return <span className="loader" aria-label="Загрузка." />;
};
