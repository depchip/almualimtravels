import DOMPurify from "isomorphic-dompurify";

const YOUTUBE_EMBED = /^https:\/\/www\.youtube(-nocookie)?\.com\/embed\/[\w-]{11}/;
const COLOR_VALUE = /^(#[0-9a-f]{3,8}|rgba?\([\d\s.,%]+\))$/i;

// Only the inline styles the editor itself produces survive: alignment, text colour and highlight colour.
const ALLOWED_STYLES: Record<string, (value: string) => boolean> = {
  "text-align": (value) => ["left", "center", "right", "justify"].includes(value),
  color: (value) => COLOR_VALUE.test(value),
  "background-color": (value) => COLOR_VALUE.test(value),
};

function cleanStyle(style: string) {
  return style
    .split(";")
    .map((rule) => rule.split(":").map((part) => part.trim().toLowerCase()))
    .filter(([property, value]) => property && value && ALLOWED_STYLES[property]?.(value))
    .map(([property, value]) => `${property}: ${value}`)
    .join("; ");
}

// Iframes are only kept when they point at a YouTube embed.
DOMPurify.addHook("uponSanitizeElement", (node, data) => {
  if (data.tagName === "iframe") {
    const src = (node as Element).getAttribute?.("src") ?? "";
    if (!YOUTUBE_EMBED.test(src)) {
      node.parentNode?.removeChild(node);
    }
  }
});

DOMPurify.addHook("uponSanitizeAttribute", (_node, data) => {
  if (data.attrName === "style") {
    const cleaned = cleanStyle(data.attrValue);
    if (cleaned) data.attrValue = cleaned;
    else data.keepAttr = false;
  }
});

DOMPurify.addHook("afterSanitizeAttributes", (node) => {
  // Links that leave the site open in a new tab without leaking the opener.
  if (node.tagName === "A" && /^https?:/.test(node.getAttribute("href") ?? "")) {
    node.setAttribute("target", "_blank");
    node.setAttribute("rel", "noopener noreferrer");
  }
  // Checklist boxes are for display only on the public site.
  if (node.tagName === "INPUT") {
    node.setAttribute("disabled", "");
  }
});

export function sanitizePostHtml(html: string) {
  return DOMPurify.sanitize(html, {
    ADD_TAGS: ["iframe"],
    ADD_ATTR: ["allow", "allowfullscreen", "frameborder", "target", "loading"],
    FORBID_TAGS: ["form", "button", "select", "textarea", "style", "script"],
  });
}
