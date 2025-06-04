"use client";
import React from "react";

const ErrorPage = ({ statusCode }) => {
  return (
    <div>
      <h1>{statusCode ? `Error ${statusCode}` : "An error occurred"}</h1>
      <p>Sorry, something went wrong.</p>
    </div>
  );
};

ErrorPage.getInitialProps = async ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default ErrorPage; // => Funktioniert
// https://nextjs.org/docs/app/api-reference/file-conventions/error