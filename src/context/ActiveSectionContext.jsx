import { createContext, useContext, useState } from "react";

const ActiveSectionContext = createContext();

export const useActiveSectionContext = () => {
    const context = useContext(ActiveSectionContext);
    if (!context) {
        throw Error("The context cannot be used outside of it's provider");
    }

    return context;
}


export const ActiveSectionContextProvider = ({ children }) => {
  const [activeSection, setActiveSection] = useState("");

  return (
    <ActiveSectionContext.Provider value={{ activeSection, setActiveSection}}>
        { children}
    </ActiveSectionContext.Provider>
  )
}