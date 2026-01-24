'use client';

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker, DayPickerSingleProps, SelectSingleEventHandler } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

// --- Type d’événement Discord ---
export type DiscordEvent = {
  id: string;
  name: string;
  scheduled_start_time: string;
};

// --- Props du composant Calendar ---
export type CalendarProps = Omit<DayPickerSingleProps, "children" | "mode"> & {
  events?: DiscordEvent[];
  className?: string;
  classNames?: Record<string, string>;
  onSelect?: SelectSingleEventHandler;
};

/**
 * Composant Calendar
 * Mode unique "single" pour utiliser SelectSingleEventHandler
 */
export function Calendar({
  events = [],
  className,
  classNames,
  onSelect,
  selected,
  ...props
}: CalendarProps) {
  // Créer un mapping date → événements
  const eventMap: Record<string, DiscordEvent[]> = React.useMemo(() => {
    const map: Record<string, DiscordEvent[]> = {};
    events.forEach((event) => {
      const dateKey = new Date(event.scheduled_start_time).toDateString();
      if (!map[dateKey]) map[dateKey] = [];
      map[dateKey].push(event);
    });
    return map;
  }, [events]);

  return (
    <section className="border rounded-lg shadow-sm p-4 bg-card text-card-foreground">
      <DayPicker
        mode="single" // ✅ forcer le mode single
        selected={selected} // ✅ typé Date | undefined
        onSelect={onSelect} // ✅ SelectSingleEventHandler
        showOutsideDays
        className={cn("p-3 text-foreground", className)}
        classNames={{
          months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
          month: "space-y-4",
          caption: "flex justify-center pt-1 relative items-center",
          caption_label: "text-sm font-semibold text-foreground",
          nav: "space-x-1 flex items-center",
          nav_button: cn(
            buttonVariants({ variant: "outline" }),
            "h-7 w-7 bg-transparent p-0 opacity-70 hover:opacity-100"
          ),
          nav_button_previous: "absolute left-1",
          nav_button_next: "absolute right-1",
          table: "w-full border-collapse space-y-1",
          head_row: "flex",
          head_cell: "text-muted-foreground rounded-md w-9 font-medium text-[0.8rem]",
          row: "flex w-full mt-2",
          cell: "h-9 w-9 text-center text-sm p-0 relative focus-within:relative focus-within:z-20",
          day: cn(
            buttonVariants({ variant: "ghost" }),
            "h-9 w-9 p-0 font-normal aria-selected:opacity-100 text-foreground"
          ),
          day_selected:
            "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
          day_today:
            "relative border-2 border-primary text-foreground font-semibold bg-primary/10 rounded-full before:absolute before:inset-0 before:rounded-full before:ring-2 before:ring-primary/40 before:animate-pulse",
          day_outside: "day-outside text-muted-foreground opacity-60 aria-selected:bg-accent/50",
          day_disabled: "text-muted-foreground opacity-50",
          ...classNames,
        }}
        components={{
          Day: ({ date, ...buttonProps }) => {
            const dateKey = date.toDateString();
            const eventsForDay = eventMap[dateKey] || [];

            return (
              <button
                {...buttonProps}
                className={cn(
                  buttonVariants({ variant: "ghost" }),
                  "relative h-9 w-9 p-0 font-normal aria-selected:opacity-100 text-foreground group"
                )}
              >
                {date.getDate()}
                {eventsForDay.length > 0 && (
                  <>
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-primary rounded-full"></span>
                    <span className="absolute bottom-full mb-1 hidden group-hover:block bg-card text-card-foreground p-1 rounded shadow text-xs z-50 whitespace-nowrap">
                      {eventsForDay.map((e) => (
                        <div key={e.id}>{e.name}</div>
                      ))}
                    </span>
                  </>
                )}
              </button>
            );
          },
          IconLeft: ({ className, ...iconProps }) => (
            <ChevronLeft className={cn("h-4 w-4", className)} {...iconProps} />
          ),
          IconRight: ({ className, ...iconProps }) => (
            <ChevronRight className={cn("h-4 w-4", className)} {...iconProps} />
          ),
        }}
        {...props} // ✅ props restants (locale, styles, etc.)
      />
    </section>
  );
}

Calendar.displayName = "Calendar";
