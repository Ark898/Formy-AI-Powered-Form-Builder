"use client";
import { useEffect } from "react";
import { init } from "react-grab";

export default function ReactGrabWrapper() {
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      init();
    }
  }, []);

  return null;
}
