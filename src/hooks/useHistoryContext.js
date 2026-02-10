import { useContext } from "react";
import { HistoryContext } from "../contexts/HistoryContext";

export const useHistoryContext = () => {
  const context = useContext(HistoryContext);
  if (!context) {
    throw new Error("useHistoryContext must be used within a HistoryProvider");
  }
  return context;
};
