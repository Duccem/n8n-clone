export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen flex font-sans">
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="relative z-10 flex flex-col justify-between w-full px-12 py-12 bg-primary">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center mr-3">
              <div className="w-4 h-4 rounded-md bg-primary" />
            </div>
            <h1 className="text-xl font-semibold text-white">Nodebase</h1>
          </div>

          <div className="flex-1 flex flex-col justify-center">
            <h2 className="text-4xl text-white mb-6 leading-tight">
              Enhance your life with the mental health support you deserve.
            </h2>
            <p className="text-white text-lg leading-relaxed">
              Join Helsa today and take the first step towards a healthier,
            </p>
          </div>

          <div className="flex justify-between items-center  text-sm">
            <span className="text-white">
              Copyright © 2025 Lumen Dev Studio LLC.
            </span>
            <span className="cursor-pointer text-white">Privacy Policy</span>
          </div>
        </div>
      </div>
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background">
        {children}
      </div>
    </div>
  );
}

