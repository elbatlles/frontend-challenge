import { documentStore } from "../../stores/DocumentStore";
import type { DocumentItem } from "../../types";

export class DocumentList extends HTMLElement {
  private container!: HTMLDivElement;
  private currentSort: keyof DocumentItem | null = null;
  private currentView: "list" | "grid" = "list";

  connectedCallback() {
    this.innerHTML = `
      <div class="mb-4 flex items-center justify-between">
        <div>
          <label class="text-sm text-gray-700 mr-2" for="sort-select">Sort by:</label>
          <select id="sort-select" class="border-transparent text-blue-500 rounded p-1 text-sm">
            <option disabled selected value="">Select one...</option>
            <option value="Title">Title</option>
            <option value="Version">Version</option>
            <option value="CreatedAt">Created</option>
          </select>
        </div>
        <div class="flex gap-2 items-center">
          <button id="view-list" title="List View" class="text-gray-500 hover:text-blue-600">📄</button>
          <button id="view-grid" title="Grid View" class="text-gray-500 hover:text-blue-600">🔲</button>
        </div>
      </div>
      <div id="list-container" class="flex flex-col gap-3 mb-3.5"></div>
    `;

    this.container = this.querySelector("#list-container") as HTMLDivElement;

    const select = this.querySelector("#sort-select") as HTMLSelectElement;
    this.currentSort = select.value as keyof DocumentItem;
    select.addEventListener("change", () => {
      this.currentSort = select.value as keyof DocumentItem;
      this.renderList();
    });

    const btnGrid = this.querySelector("#view-grid") as HTMLButtonElement;
    const btnList = this.querySelector("#view-list") as HTMLButtonElement;

    btnGrid?.addEventListener("click", () => {
      this.currentView = "grid";
      this.renderList();
    });

    btnList?.addEventListener("click", () => {
      this.currentView = "list";
      this.renderList();
    });
  }

  private showAddDocumentForm() {
    if (this.querySelector("#new-doc-form")) return;

    this.container.insertAdjacentHTML(
      "beforeend",
      `
      <form id="new-doc-form" class="grid grid-cols-3 gap-2 bg-white shadow rounded p-4 mt-2 text-sm">
        <input name="title" class="col-span-1 border p-1 rounded" placeholder="Title" required />
        <input name="version" class="col-span-1 border p-1 rounded" placeholder="Version" required />
        <input name="contributors" class="col-span-1 border p-1 rounded" placeholder="Contributors (comma separated)" />
        <input name="attachments" class="col-span-3 border p-1 rounded" placeholder="Attachments (comma separated)" />
        <button type="submit" class="col-span-3 bg-blue-600 text-white py-1 px-2 rounded">Add</button>
      </form>
    `
    );

    const form = this.querySelector("#new-doc-form") as HTMLFormElement;
    form?.addEventListener("submit", (e) => {
      e.preventDefault();
      const data = new FormData(form);
      const newDoc: DocumentItem = {
        ID: crypto.randomUUID(),
        Title: data.get("title") as string,
        Version: data.get("version") as string,
        Contributors: (data.get("contributors") as string)
          .split(",")
          .filter(Boolean)
          .map((name) => ({ ID: crypto.randomUUID(), Name: name.trim() })),
        Attachments: (data.get("attachments") as string)
          .split(",")
          .filter(Boolean)
          .map((a) => a.trim()),
        CreatedAt: new Date().toISOString(),
        UpdatedAt: new Date().toISOString(),
      };

      documentStore.setDocuments([...documentStore.getDocuments(), newDoc]);

      this.renderList();
    });
  }

  renderList() {
    if (!this.container) return;

    let sorted = [...documentStore.getDocuments()];

    if (this.currentSort) {
      sorted.sort((a, b) => {
        const valA = a[this.currentSort!];
        const valB = b[this.currentSort!];

        if (this.currentSort === "CreatedAt") {
          return (
            new Date(valA as string).getTime() -
            new Date(valB as string).getTime()
          );
        }

        if (typeof valA === "string" && typeof valB === "string") {
          return valA.localeCompare(valB);
        }

        return 0;
      });
    }

    let content = "";

    if (this.currentView === "list") {
      content += `
        <div class="grid grid-cols-3 text-sm font-semibold text-gray-600 px-4 mb-2">
          <div>Name</div>
          <div>Contributors</div>
          <div>Attachments</div>
        </div>
        <div class="flex flex-col gap-3">
          ${sorted
            .map(
              (doc) => `
                <div class="grid grid-cols-3 bg-white shadow rounded p-4 text-sm text-gray-700">
                  <div>
                    <div class="font-medium text-gray-900">${doc.Title}</div>
                    <div class="text-xs text-gray-500">v${doc.Version}</div>
                  </div>
                  <div>${doc.Contributors?.map((c) => c.Name).join(
                    "<br />"
                  )}</div>
                  <div>${doc.Attachments?.join("<br />")}</div>
                </div>
              `
            )
            .join("")}
        </div>
        <div class="text-center bg-white shadow rounded text-blue-600 font-medium cursor-pointer hover:underline p-4  " id="add-document-row">
          <div>+ Add Document</div>
        </div>
      `;
    } else {
      content += `
        <div class="grid  grid-cols-3 gap-4">
          ${sorted
            .map(
              (doc) => `
                <div class="bg-white shadow rounded p-4 text-sm text-gray-700">
                  <div class="font-medium text-gray-900">${doc.Title}</div>
                  <div class="text-xs text-gray-500 mb-2">v${doc.Version}</div>
                  <div class="text-sm text-gray-600"><strong>Contributors:</strong><br/>${doc.Contributors?.map(
                    (c) => c.Name
                  ).join("<br />")}</div>
                  <div class="text-sm text-gray-500 mt-2"><strong>Attachments:</strong><br/>${doc.Attachments?.join(
                    "<br />"
                  )}</div>
                </div>
              `
            )
            .join("")}
          <div class="bg-gray-100 shadow rounded content-center align-middle  not-even: text-blue-600 text-center font-medium cursor-pointer hover:underline h-12" id="add-document-row">
            + Add Document
          </div>
        </div>
      `;
    }

    this.container.innerHTML = content;

    const addRow = this.container.querySelector("#add-document-row");
    addRow?.addEventListener("click", () => this.showAddDocumentForm());
  }
}

customElements.define("document-list", DocumentList);
