import { Sparkles } from "lucide-react";
import { GlowCard } from "@/components/ui/brand/GlowCard";

interface SmartSuggestionsProps {
  title: string;
  suggestions: string[];
  allGoodLabel: string;
}

/**
 * Rule-based hints derived from existing dashboard data — deliberately NOT an
 * AI/LLM call (RANDEVO_PREMIUM_UI_REDESIGN_PLAN.md §5.3: "AI hissi vermeden
 * akıllı öneriler"). Rule evaluation happens in the parent server component
 * so translated/interpolated strings are resolved in one place.
 */
export function SmartSuggestions({ title, suggestions, allGoodLabel }: SmartSuggestionsProps) {
  const items = suggestions.length > 0 ? suggestions : [allGoodLabel];

  return (
    <GlowCard className="p-5">
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      <ul className="mt-4 flex flex-col gap-3">
        {items.map((suggestion) => (
          <li key={suggestion} className="flex items-start gap-2.5 text-sm text-muted-foreground">
            <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-warm-accent" aria-hidden="true" />
            {suggestion}
          </li>
        ))}
      </ul>
    </GlowCard>
  );
}
