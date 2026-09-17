import { OAUTH_STATE_COOKIE, encodeOAuthState } from "@shared/const";

export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

export const startLogin = () => {
  const oauthPortalUrl = import.meta.env.VITE_OAUTH_PORTAL_URL;
  const appId = import.meta.env.VITE_APP_ID;
  const apiBaseUrl =
    import.meta.env.VITE_API_BASE_URL || window.location.origin;

  if (!oauthPortalUrl || !appId) {
    console.error("Manus OAuth is not configured.", {
      hasOAuthPortalUrl: Boolean(oauthPortalUrl),
      hasAppId: Boolean(appId),
    });
    window.alert("Sign-in is not configured yet. Please contact the site owner.");
    return;
  }

  const redirectUri = `${apiBaseUrl.replace(/\/$/, "")}/api/oauth/callback`;
  const nonce = crypto.randomUUID();

  document.cookie = [
    `${OAUTH_STATE_COOKIE}=${nonce}`,
    "Path=/",
    "Max-Age=600",
    "SameSite=None",
    "Secure",
  ].join("; ");

  const state = encodeOAuthState({ redirectUri, nonce });
  const url = new URL(`${oauthPortalUrl.replace(/\/$/, "")}/app-auth`);

  url.searchParams.set("appId", appId);
  url.searchParams.set("redirectUri", redirectUri);
  url.searchParams.set("state", state);
  url.searchParams.set("type", "signIn");

  window.location.assign(url.toString());
};
