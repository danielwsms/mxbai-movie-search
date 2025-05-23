"use client";

import { motion } from "framer-motion";

import { Suggestion } from "./suggestion";

const variants = {
  initial: {
    opacity: 0,
    y: 5,
  },
  animate: {
    opacity: 1,
    y: 0,
  },
};

export default function SuggestionList() {
  return (
    <ul
      aria-label="Prompt suggestions"
      className="flex flex-wrap justify-center gap-2"
    >
      <motion.li
        {...variants}
        transition={{ delay: 0.1 }}
        className="order-3 sm:order-1"
      >
        <Suggestion query="A voyage through space and time" />
      </motion.li>

      <motion.li
        {...variants}
        transition={{ delay: 0.2 }}
        className="order-2 sm:order-2"
      >
        <Suggestion query="A rat cooking in paris" />
      </motion.li>
    </ul>
  );
}
