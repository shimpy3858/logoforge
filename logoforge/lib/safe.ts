// Checks for AI-written SVG / HTML. Anything suspicious is rejected, not repaired.
const BAD =
  /<\s*(script|foreignObject|iframe|object|embed|link|base|form|image|audio|video|canvas)\b|\son[a-z]+\s*=|javascript:|vbscript:|@import|http-equiv|url\(\s*(?:"(?!#)|'(?!#)|(?!["'#]))|(?:href|src|action|formaction)\s*=\s*(?:"(?!#)|'(?!#)|(?!["'#]))|attributeName\s*=\s*["']?(?:xlink:)?(?:href|on)/i;

const strip = (t: string) => t.replace(/```[a-z]*\n?/gi, "").trim();

export function extractSvg(text: string): string | null {
  const t = strip(text);
  const s = t.search(/<svg[\s>]/i), e = t.toLowerCase().lastIndexOf("</svg>");
  if (s < 0 || e < 0) return null;
  let svg = t.slice(s, e + 6);
  if (svg.length > 60_000 || BAD.test(svg)) return null;
  if (!/xmlns=/.test(svg)) svg = svg.replace(/<svg/i, '<svg xmlns="http://www.w3.org/2000/svg"');
  if (!/<svg[^>]*\swidth=/i.test(svg)) svg = svg.replace(/<svg/i, '<svg width="600" height="300"');
  if (!/viewBox=/i.test(svg)) svg = svg.replace(/<svg/i, '<svg viewBox="0 0 600 300"');
  return svg;
}

export function extractHtml(text: string): string | null {
  const t = strip(text);
  const s = t.search(/<!doctype html|<html[\s>]/i), e = t.toLowerCase().lastIndexOf("</html>");
  if (s < 0 || e < 0) return null;
  const html = t.slice(s, e + 7);
  if (html.length > 90_000 || BAD.test(html)) return null;
  return html;
}
