import React, { useState } from "react";

function ForgetPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      
      const response = await fetch("/api/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setMessage("A link to reset your password has been sent to your email.");
        setIsSubmitted(true);
      } else {
        setMessage("An error occurred while sending the reset password link, please check your email address.");
      }
    } catch (error) {
      console.error("An error occurred while resetting password:", error);
      setMessage("An error occurred while sending the reset password link, please try again later.");
    }
  };

  return (
    <div>
      <h2>Forget Password</h2>
      {isSubmitted ? (
        <p>{message}</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <label>
            Email:
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          <button type="submit">reset password</button>
        </form>
      )}
    </div>
  );
}

export default ForgetPassword;
