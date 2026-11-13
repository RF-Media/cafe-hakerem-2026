"use client";

/**
 * A photo of the storefront until someone actually wants the map. A Google Maps
 * iframe costs about a megabyte and sets third-party cookies on every visit,
 * including the many that only came for the phone number.
 */
import { useState } from "react";
import { business } from "@/content/business";
import { CafeImage } from "@/components/ui/CafeImage";
import { IconPin } from "@/components/ui/icons";
import { ev } from "@/lib/analytics";

export function MapFacade({ label, imageAlt }: { label: string; imageAlt: string }) {
  const [loaded, setLoaded] = useState(false);

  if (loaded) {
    return (
      <iframe
        title={`מפה - ${business.name.he}`}
        src={business.mapEmbed}
        className="h-full w-full rounded-card border-0"
        referrerPolicy="no-referrer-when-downgrade"
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => setLoaded(true)}
      {...ev("map_load")}
      className="group relative block h-full w-full cursor-pointer overflow-hidden rounded-card text-start focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-olive focus-visible:ring-offset-2"
    >
      <span className="zoom-frame absolute inset-0 block">
        <CafeImage
          variant="map"
          src="/images/storefront_shared.jpg"
          alt={imageAlt}
          ratio=""
          position="50% 20%"
          className="!absolute inset-0 h-full w-full"
          sizes="(max-width: 1024px) 100vw, 45vw"
        />
      </span>
      <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-espresso-deep/70 to-transparent" />
      <span className="absolute inset-x-0 bottom-0 flex justify-center p-5">
        <span className="inline-flex min-h-[48px] items-center gap-2 rounded-pill bg-cream px-6 font-medium text-espresso shadow-md transition-transform duration-fast ease-out-soft group-hover:-translate-y-0.5">
          <IconPin className="h-5 w-5" />
          {label}
        </span>
      </span>
    </button>
  );
}
