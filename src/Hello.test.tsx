import React from "react";
import {render} from "@testing-library/react";

import Hello from "/Hello";

describe("hello component", () => {
  test("importing component", () => {
    expect(Hello).toBeTruthy()
  })

  test("can render for name world", () => {
    let rendered = render(<Hello name="world" />)
    let selected = rendered.getByText("hello world")
    expect(selected).toBeTruthy()
  })
})
