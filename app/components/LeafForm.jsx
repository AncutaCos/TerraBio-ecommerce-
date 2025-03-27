// components/LeafForm.jsx
import React from "react";
import { motion } from "framer-motion";

const LeafForm = ({ children, title, icon }) => {
  return (
    <motion.div
      className="leaf-form"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className="leaf-header">
        {icon}
        <h3>{title}</h3>
      </div>
      <div className="leaf-content">{children}</div>
    </motion.div>
  );
};

export default LeafForm;