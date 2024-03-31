import { Outlet } from "react-router-dom";
import NaviHeader from "./components/Navbar/NaviHeader";
import { useSelector } from "react-redux";
import { useEffect } from "react";

function App() {
  const darkMode = useSelector(state => state.darkMode.darkMode);
  
  useEffect(() => {
    if(darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    window.scrollTo(0, 0);
  }, [darkMode]);
  return (
    <main className={'bg-slate-200 text-black dark:bg-slate-800 dark:text-white w-full h-full min-h-[1050px] overflow-hidden'}>
      <NaviHeader/>
      <Outlet/>
    </main>
  );
}

export default App;
