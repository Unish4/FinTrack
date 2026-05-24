import { SignIn } from "@clerk/react";
import { Link } from "react-router";
import { ShieldCheck, ChartNoAxesCombined, Receipt } from "lucide-react";

function SignInPage() {
  return (
    <>
      <style>{`
        [class*="socialButtonsProviderIcon"][class*="apple"],
        [class*="socialButtonsProviderIcon"] svg[class*="apple"] {
          filter: brightness(0) invert(1);
        }
        [class*="cl-card"] {
          margin: 0 !important;
          margin-right: 50px !important;
          width: 100% !important;
        }
        [class*="cl-internal"] {
          color: white !important;
        }
        [class*="identityPreview"] {
          color: white !important;
        }
        [class*="cl-footer"] {
          margin: 0 !important;
          width: 100% !important;
          justify-content: flex-start !important;
        }
        [class*="cl-footerAction"] {
          justify-content: center !important;
        }
        [class*="cl-footerActionText"],
        [class*="cl-footerActionLink"] {
          text-align: left !important;
        }
        [class*="cl-rootBox"] {
          width: 100% !important;
        }
        [class*="cl-cardBox"] {
          width: 100% !important;
        }
        @media (max-width: 1024px) {
          [class*="cl-card"] {
            margin-right: 0 !important;
          }
        }
      `}</style>
      <div className="relative min-h-screen overflow-hidden bg-[#050505] text-white">
        {/* Background */}
        <div className="absolute inset-0">
          <div className="absolute left-30 top-30 h-87.5 w-87.5 rounded-full bg-violet-600/20 blur-3xl" />
          <div className="absolute bottom-35 right-30 h-87.5 w-87.5 rounded-full bg-indigo-600/20 blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(124,58,237,0.12),transparent_40%)]" />
        </div>

        {/* Navbar */}
        <header className="relative z-10 border-b border-white/10 backdrop-blur-xl">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
            <Link
              to="/"
              className="flex items-center gap-3 transition-opacity hover:opacity-80"
            >
              <img
                src="/logo.png"
                alt="FinTrack Logo"
                className="w-5 h-5 object-contain"
              />

              <span className="text-lg font-serif tracking-tight text-white">
                FinTrack
              </span>
            </Link>

            <Link
              to="/sign-up"
              className="text-sm text-zinc-400 transition-colors hover:text-white"
            >
              Don't have an account?
            </Link>
          </div>
        </header>

        {/* Main */}
        <main className="relative z-10 mx-auto flex min-h-[calc(100vh-64px)] max-w-7xl flex-col-reverse items-center justify-center gap-10 px-4 py-8 sm:px-6 lg:flex-row lg:gap-14">
          {/* Left Side */}
          <div className="w-full max-w-xl order-last lg:order-first">
            <h1 className="mb-6 text-4xl font-serif text-center leading-tight tracking-tight text-white sm:mb-8 sm:text-5xl">
              Welcome back to
              <br />
              FinTrack.
            </h1>

            <p className="mt-4 max-w-lg text-base leading-7 text-center text-zinc-400 sm:mt-5">
              Sign in to access your dashboard, track expenses, and manage your
              finances with powerful analytics.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 sm:mt-10">
              <div className="group rounded-3xl border border-white/10 bg-white/4 p-5 backdrop-blur-xl transition-all duration-300 hover:border-violet-500/30 hover:bg-white/4 text-center">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-500/10 transition-all duration-300 group-hover:bg-violet-500/20 mx-auto">
                  <ChartNoAxesCombined className="text-violet-400" size={20} />
                </div>

                <h3 className="font-semibold text-white">Advanced Analytics</h3>

                <p className="mt-2 text-sm leading-6 text-zinc-400">
                  Visualize income, expenses, and category trends with charts.
                </p>
              </div>

              <div className="group rounded-3xl border border-white/10 bg-white/4 p-5 backdrop-blur-xl transition-all duration-300 hover:border-indigo-500/30 hover:bg-white/4 text-center">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-500/10 transition-all duration-300 group-hover:bg-indigo-500/20 mx-auto">
                  <Receipt className="text-indigo-400" size={20} />
                </div>

                <h3 className="font-semibold text-white">Receipt Uploads</h3>

                <p className="mt-2 text-sm leading-6 text-zinc-400">
                  Store and manage receipts securely with Cloudinary.
                </p>
              </div>

              <div className="group rounded-3xl border border-white/10 bg-white/4 p-5 backdrop-blur-xl sm:col-span-2 transition-all duration-300 hover:border-emerald-500/30 hover:bg-white/4 text-center">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/10 transition-all duration-300 group-hover:bg-emerald-500/20 mx-auto">
                  <ShieldCheck className="text-emerald-400" size={20} />
                </div>

                <h3 className="font-semibold text-white">
                  Secure Authentication
                </h3>

                <p className="mt-2 text-sm leading-6 text-zinc-400">
                  Protected routes, Clerk authentication, Arcjet protection, and
                  secure APIs.
                </p>
              </div>
            </div>
          </div>

          {/* Right Side */}
          <div className="w-full max-w-md order-first lg:order-last">
            <div className="relative">
              <div className="absolute inset-0 rounded-4xl bg-linear-to-b from-violet-500/20 to-indigo-500/10 blur-3xl" />
              <div className="relative overflow-hidden rounded-4xl border border-white/10 bg-[#0d0d10]/95 p-2 shadow-2xl backdrop-blur-2xl transition-all duration-300 hover:border-violet-500/20 sm:p-3">
                <div className="overflow-hidden rounded-[28px] border border-white/10 bg-[#111113] p-4 sm:p-6 lg:p-8">
                  <div className="mb-4 sm:mb-6">
                    <h2 className="text-2xl font-bold text-center tracking-tight text-white sm:text-3xl">
                      Sign in to your account
                    </h2>
                    <p className="mt-6 text-sm text-zinc-400 text-center">
                      Welcome back! Please enter your details.
                    </p>
                  </div>

                  <SignIn
                    routing="path"
                    path="/sign-in"
                    signUpUrl="/sign-up"
                    fallbackRedirectUrl="/dashboard"
                    appearance={{
                      variables: {
                        colorPrimary: "#8b5cf6",
                        colorBackground: "#111113",
                        colorText: "#ffffff",
                        colorTextSecondary: "#d4d4d8",
                        colorInputBackground: "#18181b",
                        colorInputText: "#ffffff",
                        colorDanger: "#ef4444",
                        borderRadius: "14px",
                      },
                      elements: {
                        rootBox: "w-full !mx-0",
                        card: "bg-transparent shadow-none border-0 p-0 !m-0 !w-full",
                        cardBox: "!w-full",

                        headerTitle: "hidden",
                        headerSubtitle: "hidden",

                        socialButtonsBlockButton:
                          "!bg-[#18181b] !border !border-white/10 hover:!bg-[#232326] !text-white transition-all duration-200 rounded-xl h-12",
                        socialButtonsBlockButtonText:
                          "!text-white !font-medium",
                        socialButtonsProviderIcon: "",

                        dividerLine: "!bg-white/10",
                        dividerText: "!text-zinc-400 text-sm",

                        formFieldLabel: "!text-white text-sm font-medium mb-2",

                        formFieldInput:
                          "!bg-[#18181b] !border !border-white/10 !text-white placeholder:!text-zinc-500 h-12 rounded-xl focus:!border-violet-500 focus:!ring-2 focus:!ring-violet-500/20 transition-all duration-200",
                        formFieldInputShowPasswordButton:
                          "!text-zinc-400 hover:!text-white",

                        formButtonPrimary:
                          "h-12 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 !text-white font-semibold shadow-lg shadow-violet-500/20 transition-all duration-200",
                        formButtonReset: "!text-white hover:!text-violet-300",

                        footer: "!mx-0 !w-full !justify-start",
                        footerAction: "!mx-0 !justify-start !text-right",
                        footerPages: "!justify-start",
                        footerActionText: "!text-zinc-400 !text-left",
                        footerActionLink:
                          "!text-violet-400 hover:!text-violet-300 font-medium",

                        formFieldHintText: "!text-zinc-400",
                        identityPreviewText: "!text-white",
                        identityPreviewEditButton:
                          "!text-violet-400 hover:!text-violet-300",

                        otpCodeFieldInput:
                          "!bg-[#18181b] !border !border-white/10 !text-white rounded-xl",

                        formFieldErrorText: "!text-red-400 text-sm",
                        alertText: "!text-red-400",
                        alert:
                          "!bg-red-500/10 !border !border-red-500/20 rounded-xl",

                        navbarButton:
                          "!text-white hover:!text-violet-300 transition-colors",
                        formResendCodeLink:
                          "!text-violet-400 hover:!text-violet-300",
                      },
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

export default SignInPage;
