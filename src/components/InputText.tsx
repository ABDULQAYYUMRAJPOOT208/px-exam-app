import { InputTextProps } from "@/interfaces/interfaces";
import React from "react";



const InputText: React.FC<InputTextProps> = ({ value, onChange }) => {
  return (
    <div className="flex">
      <input
        type="text"
        name="text"
        className="search-bar w-full"
        placeholder="Enter Answer"
        value={value} // Set the value from props
        onChange={onChange} // Handle changes from parent
      />
        <input
          id="default-radio-1"
          type="radio"
          name="default-radio"
          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 my-auto rounded-full max-w-fit m-2"
        />
    </div>
  );
};

export default InputText;
