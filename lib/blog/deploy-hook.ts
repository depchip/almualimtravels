const deployHookUrl = process.env.NEXT_PUBLIC_DEPLOY_HOOK_URL;

export const canTriggerRebuild = Boolean(deployHookUrl);

// Asks Render to rebuild the static site so published changes get their own pre-rendered pages.
// The hook sends no CORS headers, so the request is fire-and-forget ("no-cors"): we can't read the response.
export async function triggerRebuild() {
  if (!deployHookUrl) return false;
  try {
    await fetch(deployHookUrl, { method: "POST", mode: "no-cors" });
    return true;
  } catch {
    return false;
  }
}
