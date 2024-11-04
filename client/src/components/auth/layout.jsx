import { Outlet } from "react-router-dom";

function AuthLayout() {
  return (
    <div className="flex min-h-screen w-full">
      <div
        className="hidden lg:flex items-center justify-center w-1/2 px-12 relative bg-auth-background bg-cover bg-center"
        role="complementary"
        aria-label="Welcome message"
      >
        {/* Overlay for background opacity */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0)", // Adjust opacity here
            zIndex: 1,
          }}
        />

        {/* Content on top of the overlay */}
        <div className="max-w-md space-y-6 text-center text-primary-foreground relative z-10">
          {/* <h1 className="text-5xl font-extrabold tracking-tight text-rose-800">
            Welcome  to  PopCart
          </h1> */}
        </div>
      </div>
      
      <main
        className="flex flex-1 items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8"
        role="main"
        aria-label="Authentication area"
      >
        <Outlet />
      </main>
    </div>
  );
}

export default AuthLayout;
