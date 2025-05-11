import type { DocumentItem } from "../types";

type Listener = () => void;

export class DocumentStore {
  private documents: DocumentItem[] = [];
  private readonly externalDocuments: DocumentItem[] = [];
  private readonly listeners: Listener[] = [];

  subscribe(listener: Listener) {
    this.listeners.push(listener);
  }

  notify() {
    this.listeners.forEach((listener) => listener());
  }

  setDocuments(docs: DocumentItem[]) {
    this.documents = docs;
    this.notify();
  }

  addExternalDocument(doc: DocumentItem) {
    this.externalDocuments.push(doc);
    this.notify();
  }

  getDocuments() {
    return this.documents;
  }

  getExternalDocuments() {
    return this.externalDocuments;
  }

  getExternalCount() {
    return this.externalDocuments.length;
  }
}

export const documentStore = new DocumentStore();
