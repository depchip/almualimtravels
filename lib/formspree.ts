export const FORMSPREE_ENDPOINT = "https://formspree.io/f/xojvozwn";

type FormspreePayload = Record<string, string>;

export async function submitToFormspree(payload: FormspreePayload) {
  return fetch(FORMSPREE_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });
}
