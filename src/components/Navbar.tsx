import React from "react";
import Logo from "./Logo";

const Navbar = ({ isMobile }: { isMobile: boolean }) => {
  return (
    <nav className=" flex justify-start gap-48 items-center  px-40  bg-transparent ">
      <Logo className="max-w-[130px] backdrop-blur-xs p-2 rounded-full md:rounded-none md:p-0 " />

      {!isMobile && (
        <ul className="flex gap-20 text-xl self-center  justify-self-center text-neutral-500">
          <li
            className="hover:drop-shadow-[0_0_4px_white] hover:text-neutral-200  transition
        duration-600"
          >
            ABOUT
          </li>
          <li
            className="hover:drop-shadow-[0_0_4px_white] hover:text-neutral-200   transition
        duration-600"
          >
            WORK
          </li>
          <li
            className="hover:drop-shadow-[0_0_4px_white] hover:text-neutral-200   transition
        duration-600"
          >
            CONTACT
          </li>
        </ul>
      )}
    </nav>
  );
};

export default Navbar;
