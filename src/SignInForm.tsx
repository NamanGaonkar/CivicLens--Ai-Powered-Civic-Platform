"use client";
import { useAuthActions } from "@convex-dev/auth/react";
import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { toast } from "sonner";

export function SignInForm() {
  const { signIn } = useAuthActions();
  const [flow, setFlow] = useState<"signIn" | "signUp">("signIn");
  const [submitting, setSubmitting] = useState(false);
  // additional profile fields for sign up
  const [fullName, setFullName] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [organization, setOrganization] = useState("");
  const [bio, setBio] = useState("");

  // NOTE: server mutation to persist profiles is not yet implemented in the generated API.
  // We keep a placeholder here for when a createProfile mutation is added server-side.
  // const createProfile = useMutation(api.accounts.createProfile);

  return (
    <div className="w-full">
      <form
        className="flex flex-col space-y-4"
        onSubmit={async (e) => {
          e.preventDefault();
          setSubmitting(true);
          const form = e.target as HTMLFormElement;
          const formData = new FormData(form);
          formData.set("flow", flow);

          try {
            await signIn("password", formData);

            // If this was a sign up, we collected additional profile fields above.
            // Server-side persistence (createProfile) should be implemented separately
            // and invoked here (e.g. createProfile({ fullName, displayName, phone, city, organization, bio })).

            if (flow === "signUp") {
              toast.success("Signed up successfully. You can complete your profile in settings.");
            }
          } catch (error: any) {
            let toastTitle = "";
            if (error?.message?.includes("Invalid password")) {
              toastTitle = "Invalid password. Please try again.";
            } else {
              toastTitle =
                flow === "signIn"
                  ? "Could not sign in, did you mean to sign up?"
                  : "Could not sign up, did you mean to sign in?";
            }
            toast.error(toastTitle);
            setSubmitting(false);
          }
        }}
      >
        <input
          className="auth-input-field"
          type="email"
          name="email"
          placeholder="Email"
          required
        />
        <input
          className="auth-input-field"
          type="password"
          name="password"
          placeholder="Password"
          required
        />

        {flow === "signUp" && (
          <>
            <input
              className="auth-input-field"
              type="text"
              name="fullName"
              placeholder="Full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
            <input
              className="auth-input-field"
              type="text"
              name="displayName"
              placeholder="Display name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />
            <input
              className="auth-input-field"
              type="tel"
              name="phone"
              placeholder="Phone (optional)"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <input
              className="auth-input-field"
              type="text"
              name="city"
              placeholder="City (optional)"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
            <input
              className="auth-input-field"
              type="text"
              name="organization"
              placeholder="Organization (optional)"
              value={organization}
              onChange={(e) => setOrganization(e.target.value)}
            />
            <textarea
              className="auth-input-field h-24"
              name="bio"
              placeholder="Short bio (optional)"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </>
        )}
        <button className="auth-button" type="submit" disabled={submitting}>
          {flow === "signIn" ? "Sign in" : "Sign up"}
        </button>
        <div className="text-center text-sm text-secondary">
          <span>
            {flow === "signIn"
              ? "Don't have an account? "
              : "Already have an account? "}
          </span>
          <button
            type="button"
            className="text-primary hover:text-primary-hover hover:underline font-medium cursor-pointer"
            onClick={() => setFlow(flow === "signIn" ? "signUp" : "signIn")}
          >
            {flow === "signIn" ? "Sign up instead" : "Sign in instead"}
          </button>
        </div>
      </form>
      <div className="flex items-center justify-center my-3">
        <hr className="my-4 grow border-gray-200" />
        <span className="mx-4 text-secondary">or</span>
        <hr className="my-4 grow border-gray-200" />
      </div>
      <button className="auth-button" onClick={() => void signIn("anonymous")}>
        Sign in anonymously
      </button>
    </div>
  );
}
