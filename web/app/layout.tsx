import "../styles/globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 p-6 max-w-3xl mx-auto">
        {children}
      </body>
    </html>
  );
}