"use client";
import Gate from "@/components/Gate";
import Logo from "@/components/Logo";
import Main from "@/components/Main"; // you'll create this
import StarMask from "@/components/StarMask";
import useIsMobile from "@/Hooks/useIsMobile";
import { Hamburger, MenuIcon } from "lucide-react";
import { useState } from "react";

export default function Home() {
  const [confirmed, setConfirmed] = useState(false);
  const [heavyReady, setHeavyReady] = useState(false);
  const isMobile = useIsMobile();
  return (
    <>
      {!confirmed && (
        <Gate
          setConfirmed={setConfirmed}
          ready={heavyReady}
          isMobile={isMobile}
        />
      )}

      {/* Heavy page is loading even if Gate is showing */}
      <div
        style={{ display: confirmed ? "block" : "none" }}
        className="relative w-full h-screen overflow-hidden"
      >
        <Main onReady={() => setHeavyReady(true)} isMobile={isMobile} />
        <StarMask />
        <nav className="absolute top-5 left-0 z-30 flex justify-start gap-48 items-center  ">
          <Logo className="max-w-[130px]" />

          {!isMobile && (
            <ul className="flex gap-4 text-2xl self-center  justify-self-center ">
              <li
                className="hover:drop-shadow-[0_0_4px_white]   transition
        duration-600"
              >
                ABOUT
              </li>
              <li
                className="hover:drop-shadow-[0_0_4px_white]   transition
        duration-600"
              >
                WORK
              </li>
              <li
                className="hover:drop-shadow-[0_0_4px_white]   transition
        duration-600"
              >
                CONTACT
              </li>
            </ul>
          )}
        </nav>
      </div>
    </>
  );
}
