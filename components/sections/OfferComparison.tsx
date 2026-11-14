/**
 * Guest vs club member on /offers, as a real <table> so the comparison reads
 * row by row to a screen reader too. The member column is the amber one: the
 * club's colour, and the column the eye should land on.
 *
 * Club rows come from `offers.comparison.rows`; every offer open to everyone
 * is appended from `offers.items`, ticked in both columns.
 */
import { clubJoinUrl } from "@/content/business";
import { offers } from "@/content/offers";
import { Button } from "@/components/ui/Button";
import { IconArrow, IconCheck, IconStamp } from "@/components/ui/icons";
import { PromoValue, TimeText } from "./OfferCard";

type Row = { label: string; note?: string; guest: boolean; member: string | true };

export function OfferComparison() {
  const c = offers.comparison;
  const rows: Row[] = [
    ...c.rows.map((r) => ({ ...r, guest: false })),
    ...offers.items
      .filter((o) => o.exclusivity === "all")
      .map((o) => ({ label: o.title, note: o.window, guest: true, member: true as const })),
  ];

  const included = (strong: boolean) => (
    <>
      <span
        aria-hidden
        className={`inline-grid h-8 w-8 place-items-center rounded-full ${strong ? "bg-cs-ink text-amber" : "bg-sage text-olive"}`}
      >
        <IconCheck className="h-4 w-4" />
      </span>
      <span className="sr-only">{c.included}</span>
    </>
  );

  return (
    <div className="overflow-hidden rounded-[22px] border border-stroke bg-cream-3 shadow-md">
      <table className="w-full border-collapse">
        <caption className="sr-only">{c.caption}</caption>
        <thead>
          <tr>
            <th scope="col" className="px-4 pb-4 pt-5 text-start align-bottom md:px-6">
              <span className="type-index text-xs text-espresso-soft">{c.cols.benefit}</span>
            </th>
            <th scope="col" className="w-[19%] px-1 pb-4 pt-5 text-center align-bottom md:w-[20%] md:px-2">
              <span className="type-sub text-sm text-espresso-soft md:text-base">{c.cols.guest}</span>
            </th>
            <th scope="col" className="w-[30%] bg-amber px-2 pb-4 pt-5 text-center align-bottom text-cs-ink md:w-[26%]">
              <span className="mb-2 inline-flex items-center gap-1 rounded-pill bg-cs-ink px-2.5 py-0.5 text-[0.7rem] font-medium text-amber md:text-xs">
                <IconStamp className="h-3 w-3" />
                {c.memberTag}
              </span>
              <span className="block type-sub text-sm md:text-lg">{c.cols.member}</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label} className="border-t border-stroke">
              <th scope="row" className="px-4 py-3.5 text-start font-normal md:px-6 md:py-4">
                <span className="block text-sm font-medium text-espresso md:text-base">
                  {row.label.replace("Happy Hour", "Happy\u00A0Hour")}
                </span>
                {row.note ? (
                  <span className="mt-0.5 block text-xs text-espresso-soft md:text-sm">
                    <TimeText>{row.note}</TimeText>
                  </span>
                ) : null}
              </th>
              <td className="px-2 text-center">
                {row.guest ? (
                  included(false)
                ) : (
                  <>
                    <span aria-hidden className="text-lg text-espresso-soft">
                      —
                    </span>
                    <span className="sr-only">{c.notIncluded}</span>
                  </>
                )}
              </td>
              <td className="bg-amber-wash px-2 text-center text-cs-ink">
                {row.member === true ? (
                  included(true)
                ) : (
                  <span className="inline-flex min-w-[3.5rem] justify-center rounded-pill bg-amber px-2.5 py-1">
                    <PromoValue value={row.member} className="type-sub text-base font-bold leading-tight md:text-xl" />
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="border-t border-stroke">
            <td colSpan={3} className="p-4 md:px-6 md:py-5">
              <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-espresso-soft md:text-base">{c.footer}</p>
                <Button as="a" href={clubJoinUrl("offers_table")} external variant="ink" icon={<IconArrow />}>
                  {c.cta}
                </Button>
              </div>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
