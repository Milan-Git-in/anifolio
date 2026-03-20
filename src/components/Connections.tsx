import React from "react";
import { connection, connections } from "@/util";
import FloatItem from "./FloatItem";
const Connection = ({ borders }: { borders?: boolean }) => {
  const border = borders === false ? borders : true;
  return (
    <div className="flex pointer-events-auto">
      {connections.map((connection, index) => {
        return (
          <div key={index}>
            <FloatItem connection={connection} border={border} />
          </div>
        );
      })}
    </div>
  );
};

export default Connection;
