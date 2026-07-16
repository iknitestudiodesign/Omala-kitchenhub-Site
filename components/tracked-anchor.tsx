"use client";

import type { AnchorHTMLAttributes, MouseEvent } from "react";
import { trackEvent, type OmalaEvent } from "@/lib/analytics";

type TrackedAnchorProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  eventName: OmalaEvent;
  eventContext?: string;
};

export function TrackedAnchor({
  eventName,
  eventContext,
  onClick,
  ...props
}: TrackedAnchorProps) {
  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    trackEvent(eventName, eventContext ? { context: eventContext } : {});
    onClick?.(event);
  }

  return <a {...props} onClick={handleClick} />;
}
