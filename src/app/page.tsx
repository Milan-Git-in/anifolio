"use client";
import Gate from "@/components/Gate";
import Main from "@/components/Main"; // you'll create this
import { useState } from "react";

export default function Home() {
  const [confirmed, setConfirmed] = useState(false);
  const [heavyReady, setHeavyReady] = useState(false);

  return (
    <>
      {!confirmed && <Gate setConfirmed={setConfirmed} ready={heavyReady} />}

      {/* Heavy page is loading even if Gate is showing */}
      <div style={{ display: confirmed ? "block" : "none" }}>
        <Main onReady={() => setHeavyReady(true)} />
      </div>
    </>
  );
}
