import { type HTMLAttributes, createContext, useContext } from "react";

import { Badge, type BadgeProps } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type BadgeContextType = {
  themed: boolean;
};

const BadgeContext = createContext<BadgeContextType>({
  themed: false,
});

const useBadgeContext = () => useContext(BadgeContext);

export type AnnouncementProps = BadgeProps & {
  themed?: boolean;
};

export function Announcement({
  variant = "outline",
  themed = false,
  className,
  ...props
}: AnnouncementProps) {
  return (
    <BadgeContext.Provider value={{ themed }}>
      <Badge
        variant={variant}
        className={cn(
          "max-w-full gap-2 rounded-full bg-background px-3 py-0.5 font-medium shadow-sm transition-all",
          themed && "border-foreground/5",
          className,
        )}
        {...props}
      />
    </BadgeContext.Provider>
  );
}

export type AnnouncementTagProps = HTMLAttributes<HTMLDivElement>;

export function AnnouncementTag({ className, ...props }: AnnouncementTagProps) {
  const { themed } = useBadgeContext();

  return (
    <div
      className={cn(
        "-ml-2.5 shrink-0 truncate rounded-full bg-foreground/5 px-2.5 py-1 text-xs",
        themed && "bg-background/60",
        className,
      )}
      {...props}
    />
  );
}

export type AnnouncementTitleProps = HTMLAttributes<HTMLDivElement>;

export function AnnouncementTitle({ className, ...props }: AnnouncementTitleProps) {
  return <div className={cn("flex items-center gap-1 truncate py-1", className)} {...props} />;
}
