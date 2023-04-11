import React from "react";

type InputProps = {
  id: string;
  label: string;
  placeholder: string;
  type: string;
  register: any;
  errormessage?: string;
};

export default function Input({
  id,
  label,
  placeholder,
  type,
  register,
  errormessage
}: InputProps) {
  return (
    <div className="input-group">
      <label htmlFor={id}>{label}</label>
      <input type={type} placeholder={placeholder} {...register} />
      {errormessage && <span>{errormessage}</span>}
    </div>
  );
}
