import { createRoot } from "react-dom/client";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

const customRender = (ui: any, options: any) => {
  return render(ui, { wrapper: MemoryRouter, ...options });
};

// re-export everything
export * from "@testing-library/react";

// override render method
export { customRender as render };
