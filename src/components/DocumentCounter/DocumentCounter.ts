export class DocumentCounter extends HTMLElement {
  private badgeSpan!: HTMLElement;

  connectedCallback() {
    this.innerHTML = `
      <div class="flex items-center bg-gray-50 text-gray-500    rounded-3xl shadow-sm  p-3  pl-5 pr-5 ">
      
        <div class="relative mr-2 ">
        <i data-lucide="bell"></i>
        <i   class="w-6 h-6 text-blue-700" data-lucide="bell"></i>
          <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-black"  fill="black" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341
              C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          
          <span class="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center ">
            0
          </span>
        </div>
          <div class="text-sm font-semibold">
          New document added
        </div>
      </div>
    `;

    this.badgeSpan = this.querySelector("span")!;
  }

  update(count: number) {
    if (count > 0) {
      this.badgeSpan.textContent = count.toString();
      this.badgeSpan.classList.remove("hidden");
    } else {
      this.badgeSpan.classList.add("hidden");
    }
  }
}

customElements.define("document-counter", DocumentCounter);
