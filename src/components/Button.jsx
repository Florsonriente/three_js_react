import React from "react";
import { motion } from "framer-motion";

const Button = ({ children, onClick, className }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className={`px-6 py-2 rounded-lg bg-purple-600 text-white font-semibold shadow-md hover:bg-purple-700 transition-all duration-300 ${className}`}
      onClick={onClick}
    >
      {children}
    </motion.button>
  );
};

export default Button;
