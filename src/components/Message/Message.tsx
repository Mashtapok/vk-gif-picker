import React, { useMemo } from "react";
import { getRandomColor } from "../../helpers/gifs";
import { IMessage, useMessagesContext } from "../../hooks/useMessagesContext";
import { IconSelected } from "../../icons";

import "./Message.css";

export const Message: React.FC<IMessage> = ({ gif, text, created, id }) => {
  const { selectedMessages, toggleSelection } = useMessagesContext();

  const isSelected = useMemo(
    () => Boolean(selectedMessages.find(selected => id === selected.id)),
    [selectedMessages, id],
  );

  const onClickHandler = () => {
    toggleSelection({ gif, text, created, id });
  };

  const classNames = useMemo(() => {
    let result = "message";

    if (gif) {
      result += " message--gif";
    }
    if (isSelected) {
      result += " message--selected";
    }
    return result;
  }, [gif, isSelected]);

  return (
    <li className={classNames} onClick={onClickHandler}>
      <IconSelected
        className={isSelected ? "message__check message__check--selected" : "message__check"}
      />
      <div className="message__content">
        {text && <div className="message__text">{text}</div>}
        {gif && (
          <img
            src={gif.images.fixed_height.webp || gif.images.fixed_height.url}
            alt={gif.title}
            style={{
              background: getRandomColor(),
              width: Number(gif.images.fixed_height.width),
              height: Number(gif.images.fixed_height.height),
            }}
            draggable="false"
          />
        )}
      </div>
    </li>
  );
};
