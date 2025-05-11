import { describe, it, expect, beforeEach, vi } from "vitest";
import { DocumentStore } from "./DocumentStore";
import type { DocumentItem } from "../types";

const mockDoc = (id: string, title = "Doc"): DocumentItem => ({
  ID: id,
  Title: title,
  Version: "1.0.0",
  CreatedAt: new Date().toISOString(),
  UpdatedAt: new Date().toISOString(),
  Contributors: [],
  Attachments: [],
});

describe("DocumentStore", () => {
  let store: DocumentStore;

  beforeEach(() => {
    store = new DocumentStore();
  });

  it("sets and gets documents", () => {
    const docs = [mockDoc("1", "A"), mockDoc("2", "B")];
    store.setDocuments(docs);

    expect(store.getDocuments()).toEqual(docs);
  });

  it("adds external document", () => {
    const doc = mockDoc("external-1");
    store.addExternalDocument(doc);

    expect(store.getExternalDocuments()).toEqual([doc]);
    expect(store.getExternalCount()).toBe(1);
  });

  it("notifies listeners on setDocuments", () => {
    const listener = vi.fn();
    store.subscribe(listener);

    store.setDocuments([mockDoc("1")]);
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it("notifies listeners on addExternalDocument", () => {
    const listener = vi.fn();
    store.subscribe(listener);

    store.addExternalDocument(mockDoc("external-2"));
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it("supports multiple listeners", () => {
    const listener1 = vi.fn();
    const listener2 = vi.fn();
    store.subscribe(listener1);
    store.subscribe(listener2);

    store.setDocuments([mockDoc("3")]);
    expect(listener1).toHaveBeenCalled();
    expect(listener2).toHaveBeenCalled();
  });
});
