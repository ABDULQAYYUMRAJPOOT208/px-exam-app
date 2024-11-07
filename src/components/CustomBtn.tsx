import { customBtn } from "@/interfaces/interfaces";
import React from "react";


const CustomBtn: React.FC<customBtn> = ({ text }) => {
  return (
    <div>
      <button>
        <span className="transition" />
        <span className="gradient" />
        <span className="label">{text}</span>
      </button>
    </div>
  );
};

export default CustomBtn;
