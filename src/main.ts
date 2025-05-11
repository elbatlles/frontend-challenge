import { documentStore } from "./stores/DocumentStore";
import { type DocumentItem } from "./types";

// Component registration
import "./components/DocumentCounter/DocumentCounter.ts";
import "./components/DocumentList/DocumentList.ts";

// Component types
import type { DocumentCounter } from "./components/DocumentCounter/DocumentCounter.ts";
import type { DocumentList } from "./components/DocumentList/DocumentList.ts";

// Config
const API_URL = import.meta.env.VITE_API_URL;
const WS_URL = import.meta.env.VITE_WS_URL;

// DOM references
const counterComponent = document.querySelector(
  "document-counter"
) as DocumentCounter;
const listComponent = document.querySelector("document-list") as DocumentList;

// Store subscriptions
function setupStoreSubscription() {
  let previousSnapshot = JSON.stringify([]);

  documentStore.subscribe(() => {
    const allDocs = documentStore.getDocuments();
    const externalCount = documentStore.getExternalCount();

    const currentSnapshot = JSON.stringify(allDocs);
    if (currentSnapshot !== previousSnapshot) {
      previousSnapshot = currentSnapshot;
      listComponent.renderList();
    }

    counterComponent?.update(externalCount);
  });
}

// Fetch initial documents from HTTP API
async function fetchDocuments() {
  try {
    const res = await fetch(API_URL);
    const data: DocumentItem[] = await res.json();
    console.log("Fetched documents:", data);
    documentStore.setDocuments(data);
  } catch (error) {
    console.error("Error fetching documents:", error);
  }
}

// Setup WebSocket for real-time document notifications
function setupWebSocket() {
  const socket = new WebSocket(WS_URL);

  socket.addEventListener("message", (event) => {
    const newDoc: DocumentItem = JSON.parse(event.data);
    documentStore.addExternalDocument(newDoc);
  });

  socket.addEventListener("error", (err) => {
    console.error("[WebSocket] Error:", err);
  });

  socket.addEventListener("close", () => {
    console.warn("[WebSocket] Closed. Reconnecting...");
    setTimeout(setupWebSocket, 3000);
  });
}

// Init
setupStoreSubscription();
fetchDocuments();
setupWebSocket();
