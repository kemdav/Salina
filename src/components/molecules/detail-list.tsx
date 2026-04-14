import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type DetailListItem = {
  label: string;
  value: ReactNode;
  valueClassName?: string;
};

interface DetailListProps {
  items: DetailListItem[];
}

export function DetailList({ items }: DetailListProps) {
  return (
    <dl className="space-y-4 text-sm text-stone-300">
      {items.map((item) => (
        <div key={item.label}>
          <dt className="text-stone-500">{item.label}</dt>
          <dd className={cn("mt-1 text-stone-100", item.valueClassName)}>
            {item.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
