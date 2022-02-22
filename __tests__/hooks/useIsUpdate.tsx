import { render } from "@testing-library/react";
import * as React from "react";
import { useIsUpdate } from "../../src/hooks/useIsUpdate";

test("useIsUpdate returns false on first render, true after that", () => {
  const App = () => {
    const isUpdate = useIsUpdate();
    return <div>isUpdate: {String(isUpdate)}</div>;
  };

  const { getByText, rerender } = render(<App />);
  expect(getByText("isUpdate: false")).toBeInTheDocument();
  rerender(<App />);
  expect(getByText("isUpdate: true")).toBeInTheDocument();
});
