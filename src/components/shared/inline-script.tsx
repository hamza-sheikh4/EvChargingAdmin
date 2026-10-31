/**
 * A script that runs once while the HTML is parsed, before the first paint.
 * On the client it renders as text/plain, so React does not warn about rendering a
 * script tag (it would never run there anyway). suppressHydrationWarning covers the
 * type difference. From the Next.js guide "How to prevent flash before hydration".
 */
export function InlineScript({ html }: { html: string }) {
  return (
    <script
      type={typeof window === "undefined" ? "text/javascript" : "text/plain"}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
