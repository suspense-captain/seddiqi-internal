import React from "react";
import Head from "next/head";
import parse from 'html-react-parser';

const ScriptRenderer = (props) => {
  const { scriptLocation, script, scriptTarget } = props;

  if (!script) {
    return null;
  }

  return (
    <>
      {scriptLocation === "head" ? <Head>{parse(script)}</Head> : parse(script)}
      {scriptTarget && parse(scriptTarget)}
    </>
  );
};

export default ScriptRenderer;
