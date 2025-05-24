  import { useEffect, useState } from "react";
  import { useNavigate } from "react-router-dom";
  import { supabase } from "../../lib/supabaseClient";

  function VerifyPage() {
    const [status, setStatus] = useState("Verifying...");
    const navigate = useNavigate();

  useEffect(() => {
  const verify = async () => {
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const access_token = params.get("access_token");
    const refresh_token = params.get("refresh_token");

    if (!access_token || !refresh_token) {
      setStatus("❌ Invalid verification link.");
      return;
    }

    try {
      const { error: sessionError } = await supabase.auth.setSession({
        access_token,
        refresh_token,
      });

      if (sessionError) {
        console.error("Session error:", sessionError);
        setStatus("❌ Failed to verify session.");
        return;
      }

      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData?.user) {
        setStatus("❌ Failed to fetch user.");
        return;
      }

      const userId = userData.user.id;

      // 🟩 Add the console log here
      const rawPendingUser = localStorage.getItem("pending_user");
      console.log("📦 Raw pending user:", rawPendingUser); // <-- THIS LINE
      const pendingUser = rawPendingUser ? JSON.parse(rawPendingUser) : null;

      if (!pendingUser) {
        setStatus("✅ Email verified! No profile to sync. Redirecting...");
        setTimeout(() => navigate("/"), 2000);
        return;
      }

      const { username, email, role } = pendingUser;

      const { error: insertError } = await supabase.from("users").insert([
        {
          user_id: userId,
          username,
          email,
          role,
        },
      ]);

      if (insertError) {
        console.error("Insert user error:", insertError);
        setStatus("⚠️ Verified, but failed to save profile: " + insertError.message);
        return;
      }

      localStorage.removeItem("pending_user");
      setStatus("✅ Email verified and profile saved! Redirecting...");
      setTimeout(() => navigate("/"), 2500);
    } catch (err) {
      console.error("Unexpected error:", err);
      setStatus("❌ Unexpected error occurred.");
    }
  };

  verify();
}, [navigate]);


    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 text-center">
        <div className="p-8 bg-white rounded-xl shadow-md text-lg font-medium text-gray-800">
          {status}
        </div>
      </div>
    );
  }

  export default VerifyPage;
