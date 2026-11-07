/**
 * CoffeeStream's mark as it appears on its sign-in screen: amber cup on a dark
 * tile, Latin wordmark. Amber is CoffeeStream's colour, which is why the club
 * world on this site is built from it.
 */
import { IconCup } from "@/components/ui/icons";

export function CoffeeStreamMark({ className }: { className?: string }) {
  return (
    <span dir="ltr" className={`inline-flex items-center gap-2 ${className ?? ""}`}>
      <span className="grid h-9 w-9 place-items-center rounded-[10px] bg-cs-ink">
        <IconCup className="h-[18px] w-[18px] text-amber" />
      </span>
      <span className="text-lg font-bold tracking-tight">CoffeeStream</span>
    </span>
  );
}
