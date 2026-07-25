"use client";

import type { AnchorHTMLAttributes, MouseEvent } from "react";
import { trackEvent, type EkoraaEvent } from "@/lib/analytics";

type TrackedAnchorProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  eventName: EkoraaEvent;
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
