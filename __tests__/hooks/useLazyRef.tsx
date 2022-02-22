import { render } from "@testing-library/react";
import * as React from "react";
import { useLazyRef } from "../../src/hooks/useLazyRef";

test("useLazyRef returns the same ref, the initializer is fired only once", () => {
  let counter = 0;

  const App = () => {
    const randomNumber = useLazyRef(() => {
      counter++;
      return Math.random();
    });

    return <div>{randomNumber.current}</div>;
  };

  const { container, rerender } = render(<App />);
  const initialRandomNumber = container.textContent;

  expect(counter).toBe(1);
  rerender(<App />);
  expect(container.textContent).toBe(initialRandomNumber);
  expect(counter).toBe(1);
});
