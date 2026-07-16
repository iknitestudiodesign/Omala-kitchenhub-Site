"use client";

import Link from "next/link";
import type { ComponentProps, MouseEvent } from "react";
import { trackEvent, type OmalaEvent } from "@/lib/analytics";

type TrackedLinkProps = ComponentProps<typeof Link> & {
  eventName: OmalaEvent;
  eventContext?: string;
};

export function TrackedLink({
  eventName,
  eventContext,
  onClick,
  ...props
}: TrackedLinkProps) {
  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    trackEvent(eventName, eventContext ? { context: eventContext } : {});
    onClick?.(event);
  }

  return <Link {...props} onClick={handleClick} />;
}
