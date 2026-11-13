export const dynamic = "force-static";
export const revalidate = 86400;

import Link from "next/link";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";
import { FAQBlock } from "@/components/ui/FAQBlock";
import { FAQSchema } from "@/components/seo/FAQSchema";
import { Reveal } from "@/components/motion/Reveal";
import { CookieSettingsButton } from "@/components/cookiestream/CookieSettingsButton";
import { business } from "@/content/business";
import { cookieSettingsLabel } from "@/content/cookies";
import { privacyFAQs } from "@/content/faqs";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("privacy", { robots: { index: false, follow: true } });

export default function PrivacyPage() {
  return (
    <>
      <BreadcrumbSchema trail={[{ name: "פרטיות", href: "/privacy" }]} />
      <Breadcrumb items={[{ name: "פרטיות" }]} />
      {/* Deliberately the quietest page on the site: a reveal per section
          and nothing else. Choreographing a privacy policy would be a tell
          that the motion is decorative rather than considered. */}
      <article className="mx-auto max-w-3xl px-6 md:px-10 lg:px-16 pt-12 md:pt-20 pb-20 space-y-8">
        <h1 className="type-display text-[2.75rem] leading-[1.03] md:text-6xl text-espresso">מדיניות פרטיות</h1>
        <p className="text-sm text-espresso-soft">עודכן: 10 בנובמבר 2026</p>

        <Reveal as="section" className="space-y-3">
          <h2 className="type-title text-2xl text-espresso">איזה מידע אנחנו אוספים</h2>
          <p className="text-espresso-soft leading-relaxed">
            כשמזמינים ג'חנון או פונים למגשי אירוח באתר {business.name.he}, אנחנו שומרים את שם המזמין/ה,
            מספר הטלפון, המייל אם הוזן, וכל פרט נוסף שהוזן בטופס (למשל הערות או תאריך אירוע). המידע נשמר
            אך ורק לצורך ניהול ההזמנה ושליחת אישור עליה.
          </p>
        </Reveal>

        <Reveal as="section" className="space-y-3">
          <h2 className="type-title text-2xl text-espresso">מה אנחנו עושים איתו</h2>
          <p className="text-espresso-soft leading-relaxed">
            המידע משמש את צוות הקפה לטיפול בהזמנה. אנחנו לא מוכרים, לא משכירים ולא מעבירים את הפרטים
            לצדדים שלישיים, מלבד ספקי תשתית טכניים (אירוח, אימייל) הנדרשים כדי שהאתר יפעל.
          </p>
        </Reveal>

        <Reveal as="section" className="space-y-3">
          <h2 className="type-title text-2xl text-espresso">עוגיות (Cookies)</h2>
          <p className="text-espresso-soft leading-relaxed">
            עוגיה הכרחית אחת, cs_consent, זוכרת למשך 180 יום מה בחרתם בבאנר העוגיות, כדי שלא נשאל שוב בכל
            ביקור. העדפות הנגישות שבחרתם נשמרות בדפדפן שלכם בלבד. שני אלה לא נשלחים לשום שירות חיצוני.
          </p>
          <p className="text-espresso-soft leading-relaxed">
            אם תאשרו סטטיסטיקה בבאנר העוגיות, האתר יטען את Google Tag Manager, שמפעיל את Google Analytics
            כדי להבין כמה אנשים מבקרים באתר ובאילו עמודים. הכלי שולח ל-Google נתוני שימוש, כמו העמודים
            שנצפו, סוג המכשיר ומיקום משוער, ושומר עוגיות משלו בדפדפן. בלי אישור הוא לא נטען ולא נשלח אליו
            דבר. על המידע הזה חלה גם{" "}
            <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-olive underline underline-offset-4 hover:text-espresso">
              מדיניות הפרטיות של Google
            </a>
            .
          </p>
          <p className="text-espresso-soft leading-relaxed">
            בנוסף, Vercel Analytics סופר ביקורים באופן אנונימי, בלי עוגיות. לא נעשה שימוש בעוגיות פרסומיות.
          </p>
          <p className="text-espresso-soft leading-relaxed">
            אפשר לשנות את הבחירה בכל רגע דרך &quot;{cookieSettingsLabel}&quot; בתחתית העמוד או בכפתור כאן. אם
            תבטלו את האישור, האתר ימחק את עוגיות Google Analytics מהדפדפן ויטען את העמוד מחדש.
          </p>
          <CookieSettingsButton className="inline-flex min-h-[44px] cursor-pointer items-center rounded-pill border border-stroke bg-cream px-5 text-sm font-medium text-espresso transition-colors duration-fast hover:border-espresso">
            {cookieSettingsLabel}
          </CookieSettingsButton>
        </Reveal>

        <Reveal as="section" className="space-y-3">
          <h2 className="type-title text-2xl text-espresso">מועדון הלקוחות</h2>
          <p className="text-espresso-soft leading-relaxed">
            ההרשמה למועדון הלקוחות של {business.name.he} נעשית ב-CoffeeStream, פלטפורמה נפרדת שהאתר רק מקשר
            אליה. הפרטים שתמסרו שם נשמרים לפי{" "}
            <a href={business.coffeestream.privacyUrl} target="_blank" rel="noopener noreferrer" className="text-olive underline underline-offset-4 hover:text-espresso">
              מדיניות הפרטיות של CoffeeStream
            </a>
            .
          </p>
        </Reveal>

        <Reveal as="section" className="space-y-3">
          <h2 className="type-title text-2xl text-espresso">למחיקת הפרטים שלכם</h2>
          <p className="text-espresso-soft leading-relaxed">
            ניתן לפנות אלינו בכל עת ב-{business.phone.display} או דרך{" "}
            <Link href="/contact" className="text-olive underline underline-offset-4 hover:text-espresso">עמוד צור קשר</Link>{" "}
            לבקשת מחיקת מידע מהמערכת.
          </p>
        </Reveal>

        <div className="pt-6">
          <FAQBlock items={privacyFAQs} heading="שאלות על הפרטיות" />
          <FAQSchema items={privacyFAQs} />
        </div>
      </article>
    </>
  );
}
