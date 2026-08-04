-- New paid add-on: an extra hard-boiled egg, not included by default.
--
-- Unlike the checkout migration before this one, every existing row is
-- already correct at 0 (no order has ever been able to select this addon),
-- so a single defaulted column is enough — no backfill step needed.

ALTER TABLE "JachnunOrder"
  ADD COLUMN "extraEgg" INTEGER NOT NULL DEFAULT 0;
