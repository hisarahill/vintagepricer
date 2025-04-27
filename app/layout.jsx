export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-[#FDF6EC] font-poppins min-h-screen">{children}</body>
    </html>
  );
}
