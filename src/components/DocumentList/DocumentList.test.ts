import { describe, it, expect, beforeEach } from "vitest";
import { fireEvent, screen } from "@testing-library/dom";
import "./DocumentList";
import type { DocumentItem } from "../../types";
import { documentStore } from "../../stores/DocumentStore";

const mockDocs: DocumentItem[] = [
  {
    ID: "1",
    Title: "Alpha",
    Version: "1.0.0",
    CreatedAt: "2021-01-01",
    UpdatedAt: "",
    Contributors: [{ ID: "c1", Name: "Alice" }],
    Attachments: ["file1.pdf"],
  },
];

describe("DocumentList", () => {
  let root: HTMLElement;

  beforeEach(() => {
    document.body.innerHTML = `<document-list></document-list>`;
    root = document.querySelector("document-list")!;
    documentStore.setDocuments([]);
  });

  it("renders and displays documents", async () => {
    documentStore.setDocuments(mockDocs);
    const component = root as any;
    component.renderList();
    const title = await screen.findByText("Alpha");
    const version = screen.getByText(/v1\.0\.0/);

    expect(title).toBeTruthy();
    expect(version).toBeTruthy();
  });

  it("switches to grid view", async () => {
    const btn = screen.getByTitle("Grid View");
    fireEvent.click(btn);

    const gridContainer =
      root.shadowRoot?.querySelector(".grid") ?? root.querySelector(".grid");
    expect(gridContainer).toBeTruthy();
  });
  it("shows add document form on click", async () => {
    documentStore.setDocuments(mockDocs);
    const component = root as any;
    component.renderList();

    const addBtn = screen.getByText("+ Add Document");
    fireEvent.click(addBtn);

    const input = await screen.findByPlaceholderText("Title");
    expect(input).toBeTruthy();
  });
});
