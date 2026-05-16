import type {LucideIcon} from "lucide-react";
import type {SVGProps} from "react";

/** Wrap a Lucide icon for Sanity Studio (document types, structure items). */
export function lucideIcon(Icon: LucideIcon) {
  function SanityLucideIcon(props: SVGProps<SVGSVGElement>) {
    return <Icon size={25} strokeWidth={1.5} aria-hidden {...props} />;
  }
  SanityLucideIcon.displayName = `Sanity${Icon.displayName ?? "LucideIcon"}`;
  return SanityLucideIcon;
}
