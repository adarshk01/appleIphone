import { navLists } from "../constants";
import { appleImg, bagImg, searchImg } from "../utils";

export function Navbar() {
  return (
    <div>
      <header className="w-full py-5 sm:px-10 px-5 flex justify-between items-center">
        <nav className="flex w-full screen-max-width">
          <img src={appleImg} alt="" width={14} height={18} />
          <div className=" flex flex-1 gap-10 justify-center max-sm:hidden">
            {navLists.map((i) => {
              return (
                <div
                  key={i}
                  className="  text-sm cursor-pointer text-gray hover:text-white transition-all"
                >
                  {i}
                </div>
              );
            })}
          </div>
          <div className="flex items-baseline gap-7 max-sm:justify-end max-sm:flex-1">
            <img
              src={searchImg}
              alt=""
              width={18}
              height={18}
              className="cursor-pointer"
            />
            <img
              src={bagImg}
              alt=""
              width={18}
              height={18}
              className="cursor-pointer"
            />
          </div>
        </nav>
      </header>
    </div>
  );
}
