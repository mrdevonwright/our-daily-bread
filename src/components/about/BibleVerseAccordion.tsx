import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { BIBLE_VERSES } from "@/lib/constants";
import type { BibleVerseData } from "@/lib/types";

function VerseCard({ verse }: { verse: BibleVerseData }) {
  return (
    <AccordionItem
      value={verse.reference}
      className="border border-wheat/20 rounded-xl mb-3 px-2 overflow-hidden bg-white hover:border-wheat/40 transition-colors"
    >
      <AccordionTrigger className="hover:no-underline px-4 py-4 text-left">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-left">
          <span className="text-wheat font-medium text-sm font-serif min-w-32">
            {verse.reference}
          </span>
          <span className="text-muted-foreground text-sm font-sans font-normal">
            {verse.theme}
          </span>
        </div>
      </AccordionTrigger>
      <AccordionContent className="px-4 pb-6">
        <blockquote className="scripture text-base mb-4">
          &ldquo;{verse.text}&rdquo;
        </blockquote>
        <p className="text-muted-foreground text-sm leading-relaxed">
          {verse.reflection}
        </p>
      </AccordionContent>
    </AccordionItem>
  );
}

export function BibleVerseAccordion() {
  return (
    <div className="max-w-3xl mx-auto">
      <Accordion type="single" collapsible className="space-y-0">
        {BIBLE_VERSES.map((verse) => (
          <VerseCard key={verse.reference} verse={verse} />
        ))}
      </Accordion>
    </div>
  );
}
