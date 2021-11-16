import "react-dom";

declare module "react-dom" {
  function createRoot(container: Element): {
    render(children: React.ReactChild): void;
  };
}
