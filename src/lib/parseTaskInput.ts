import { addDays, nextMonday, nextTuesday, nextWednesday, nextThursday, nextFriday, nextSaturday, nextSunday, format } from "date-fns";
import type { Priority } from "@/types/task";

interface ParsedTask {
  title: string;
  tags: string[];
  priority?: Priority;
  date?: string; // YYYY-MM-DD
}

const dayMap: Record<string, (date: Date) => Date> = {
  monday: nextMonday,
  tuesday: nextTuesday,
  wednesday: nextWednesday,
  thursday: nextThursday,
  friday: nextFriday,
  saturday: nextSaturday,
  sunday: nextSunday,
  mon: nextMonday,
  tue: nextTuesday,
  wed: nextWednesday,
  thu: nextThursday,
  fri: nextFriday,
  sat: nextSaturday,
  sun: nextSunday,
};

const priorityMap: Record<string, Priority> = {
  "!h": "high",
  "!high": "high",
  "!m": "medium",
  "!med": "medium",
  "!medium": "medium",
  "!l": "low",
  "!low": "low",
};

export function parseTaskInput(input: string): ParsedTask {
  let remaining = input;
  const tags: string[] = [];
  let priority: Priority | undefined;
  let date: string | undefined;

  // Extract #tags
  remaining = remaining.replace(/#(\w+)/g, (_, tag) => {
    tags.push(tag);
    return "";
  });

  // Extract !priority
  remaining = remaining.replace(/!(h|high|m|med|medium|l|low)\b/gi, (match) => {
    priority = priorityMap[match.toLowerCase()];
    return "";
  });

  // Extract date keywords
  const today = new Date();
  const words = remaining.split(/\s+/);
  const filteredWords: string[] = [];

  for (const word of words) {
    const lower = word.toLowerCase();
    if (lower === "today") {
      date = format(today, "yyyy-MM-dd");
    } else if (lower === "tomorrow") {
      date = format(addDays(today, 1), "yyyy-MM-dd");
    } else if (dayMap[lower]) {
      date = format(dayMap[lower](today), "yyyy-MM-dd");
    } else {
      filteredWords.push(word);
    }
  }

  const title = filteredWords.join(" ").replace(/\s+/g, " ").trim();

  return { title, tags, priority, date };
}
