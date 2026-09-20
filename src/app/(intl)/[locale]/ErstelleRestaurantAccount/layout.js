// Registrierungsstrecke: wie die deutsche Fassung aus dem Index genommen.
// Das ist eine Konversionsseite, keine Landingpage — Google soll die
// oeffentlichen Seiten ranken, nicht das Formular.
export const metadata = {
  robots: { index: false, follow: false },
};

export default function IntlSignupLayout({ children }) {
  return children;
}
