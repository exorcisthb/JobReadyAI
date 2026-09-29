// Facebook SDK initialization script
// Moved from inline <script> in index.html to avoid CSP 'unsafe-inline'

// Note: Window.FB type is already declared in src/components/auth/auth-form.tsx
// We don't redeclare it here to avoid type conflicts

window.fbAsyncInit = function () {
  const appId = import.meta.env.VITE_FACEBOOK_APP_ID || "";
  
  if (window.FB) {
    window.FB.init({
      appId: appId,
      cookie: true,
      xfbml: true,
      version: "v21.0",
    });
  }
};

(function (d, s, id) {
  const fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) {
    return;
  }
  const js = d.createElement(s) as HTMLScriptElement;
  js.id = id;
  js.src = "https://connect.facebook.net/en_US/sdk.js";
  fjs?.parentNode?.insertBefore(js, fjs);
})(document, "script", "facebook-jssdk");
