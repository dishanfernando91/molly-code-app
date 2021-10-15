import React from "react";
import classNames from "./Output.module.scss";

const { output } = classNames;

export default function Output({ data }) {
  return (
    <div className={output}>
      <p>{data || "Output"}</p>
    </div>
  );
}
