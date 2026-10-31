const ID_PATTERN = /^[\w-]{11}$/;

// Accepts watch, youtu.be, shorts, embed, live and nocookie links. Returns the 11-character video ID.
export function parseYouTubeId(input: string): string | null {
  try {
    const url = new URL(input.trim());
    const host = url.hostname.replace(/^(www\.|m\.|music\.)/, "");

    let id: string | null = null;
    if (host === "youtu.be") {
      id = url.pathname.slice(1).split("/")[0];
    } else if (host === "youtube.com" || host === "youtube-nocookie.com") {
      id = url.searchParams.get("v") ?? url.pathname.match(/^\/(?:embed|shorts|live|v)\/([\w-]{11})/)?.[1] ?? null;
    }

    return id && ID_PATTERN.test(id) ? id : null;
  } catch {
    return null;
  }
}

// Collects the IDs of every YouTube embed in a Tiptap JSON document.
export function collectYouTubeIds(node: unknown, found = new Set<string>()): string[] {
  if (node && typeof node === "object") {
    const { type, attrs, content } = node as { type?: string; attrs?: { src?: string }; content?: unknown[] };
    if (type === "youtube" && attrs?.src) {
      const id = parseYouTubeId(attrs.src);
      if (id) found.add(id);
    }
    content?.forEach((child) => collectYouTubeIds(child, found));
  }
  return [...found];
}
