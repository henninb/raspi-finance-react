import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

// create a customRender that wraps the UI in a memory Router
const customRender = (ui: any, options: any) => {
  return render(ui, { wrapper: MemoryRouter, ...options });
};

// re-export everything
export * from "@testing-library/react";

// override render method
export { customRender as render };
