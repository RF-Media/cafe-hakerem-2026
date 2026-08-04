-- Multi-step jachnun checkout: add-ons, order total and payment state.
--
-- Written by hand rather than generated, because there is no database
-- reachable from this environment. It is the standard three-step shape for
-- adding NOT NULL columns to a table that may already hold rows: add
-- nullable, backfill, then constrain.

ALTER TABLE "JachnunOrder"
  ADD COLUMN "receiptToken"   TEXT,
  ADD COLUMN "email"          TEXT,
  ADD COLUMN "extraTomato"    INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN "extraOlives"    INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN "pickupLabel"    TEXT,
  ADD COLUMN "totalAgorot"    INTEGER,
  ADD COLUMN "paymentMethod"  TEXT,
  ADD COLUMN "paymentStatus"  TEXT,
  ADD COLUMN "paymentRef"     TEXT,
  ADD COLUMN "cardBrand"      TEXT,
  ADD COLUMN "cardLast4"      TEXT,
  ADD COLUMN "idempotencyKey" TEXT;

-- Rows taken through the old single-step form had no add-ons, no total and
-- no payment step: they were pay-at-pickup by definition, priced at the
-- flat per-unit rate.
UPDATE "JachnunOrder"
SET
  "receiptToken"  = COALESCE("receiptToken", md5(random()::text || "id")),
  "pickupLabel"   = COALESCE(
                      "pickupLabel",
                      to_char("pickupSlot" AT TIME ZONE 'Asia/Jerusalem', 'DD/MM HH24:MI')
                    ),
  "totalAgorot"   = COALESCE("totalAgorot", "quantity" * 3800),
  "paymentMethod" = COALESCE("paymentMethod", 'cash'),
  "paymentStatus" = COALESCE("paymentStatus", 'due_at_pickup');

ALTER TABLE "JachnunOrder"
  ALTER COLUMN "receiptToken"  SET NOT NULL,
  ALTER COLUMN "pickupLabel"   SET NOT NULL,
  ALTER COLUMN "totalAgorot"   SET NOT NULL,
  ALTER COLUMN "paymentMethod" SET NOT NULL,
  ALTER COLUMN "paymentStatus" SET NOT NULL;

CREATE UNIQUE INDEX "JachnunOrder_receiptToken_key"   ON "JachnunOrder"("receiptToken");
CREATE UNIQUE INDEX "JachnunOrder_idempotencyKey_key" ON "JachnunOrder"("idempotencyKey");
CREATE INDEX        "JachnunOrder_createdAt_idx"      ON "JachnunOrder"("createdAt");
