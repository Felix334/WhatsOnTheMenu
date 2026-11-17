// Persoenliche Seite hinter dem Login — nicht in den Index.
export const metadata = {
  robots: { index: false, follow: false },
};

export default function KontoLayout({ children }) {
  return children;
}
