"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";

type FAQItem = {
  question: string;
  answer: string;
};

export function FAQSection({ items }: { items: FAQItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="space-y-4">
      {items.map((item, index) => {
        const open = openIndex === index;

        return (
          <div key={item.question} className="rounded-[1.5rem] border border-primary/10 bg-white/80 p-5">
            <button
              type="button"
              onClick={() => setOpenIndex(open ? null : index)}
              className="flex w-full items-center justify-between gap-4 text-left"
            >
              <span className="font-display text-xl font-semibold">{item.question}</span>
              <ChevronDown className={`h-5 w-5 transition-transform ${open ? "rotate-180" : ""}`} />
            </button>
            {open ? <p className="mt-4 text-sm leading-7 text-muted-foreground">{item.answer}</p> : null}
          </div>
        );
      })}
    </div>
  );
}
