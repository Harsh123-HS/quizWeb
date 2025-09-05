const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Basic validations
    if (!email) return alert("Enter Email");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return alert("Enter Valid Email");
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/.test(password)) return alert("Enter strong Password!");
    if (password !== confirmPass) return alert("Passwords do not match");
    if (!userRole) return alert("Select a role");
  
    try {
      // Sign up the user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: userName,
            role: userRole,
          },
        },
      });
  
      if (error) {
        alert("Registration failed: " + error.message);
        return;
      }
  
      alert("✅ Registration successful! Check your email to confirm.");
  
      // Save user meta temporarily
      localStorage.setItem("pendingUsername", userName);
      localStorage.setItem("pendingRole", userRole);
  
      // User will be inserted into 'users' table after email confirmation + sign in
      // That logic lives in your `useEffect` auth listener (which is correct)
  
    } catch (err) {
      alert("Something went wrong: " + err.message);
    }
  };
    