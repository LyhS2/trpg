"use client";
import React, { ReactNode } from 'react';
import './globals.css';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=UnifrakturCook:wght@700&family=MedievalSharp&display=swap" rel="stylesheet" />
      </head>
      <body style={{ fontFamily: "UnifrakturCook, MedievalSharp, serif", background: "#f5efe6", color: "#2d1a05" }}>
        {children}
      </body>
    </html>
  );
} 