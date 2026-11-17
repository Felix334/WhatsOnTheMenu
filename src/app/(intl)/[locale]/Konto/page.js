import AccountPage from "@/app/components/AccountPage";
import { getDictionary } from "@/i18n";

// /account (Englisch) und /de/Konto. Der Ordner heisst "Konto", der englische
// Pfad kommt aus src/i18n/slugs.mjs.

export async function generateMetadata({ params }) {
  const { locale } = await params;
  return { title: getDictionary(locale).account.metaTitle };
}

export default async function Page({ params }) {
  const { locale } = await params;
  return <AccountPage t={getDictionary(locale).account} locale={locale} />;
}
