import { describe, it, expect, beforeEach } from "vitest";
import "./DocumentCounter";

describe("DocumentCounter", () => {
  let counter: HTMLElement;

  beforeEach(() => {
    document.body.innerHTML = "";
    const el = document.createElement("document-counter");
    document.body.appendChild(el);
    counter = document.querySelector("document-counter")!;
  });

  it("renders with initial badge text 0", () => {
    const span = counter.querySelector("span")!;

    expect(span).toBeTruthy();
    console.log(span);
    expect(span?.textContent?.trim()).toBe("0");
  });

  it("updates the badge number correctly", () => {
    (counter as any).update(5);
    const span = counter.querySelector("span")!;
    expect(span.textContent).toBe("5");

    expect(span.classList.contains("hidden")).toBe(false);
  });

  it("hides the badge when count is 0", () => {
    (counter as any).update(0);
    const span = counter.querySelector("span")!;
    expect(span.classList.contains("hidden")).toBe(true);
  });

  it("shows the badge again when count increases", () => {
    (counter as any).update(0);
    (counter as any).update(2);
    const span = counter.querySelector("span")!;
    expect(span.textContent).toBe("2");
    expect(span.classList.contains("hidden")).toBe(false);
  });
});
