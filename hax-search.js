/**
 * Copyright 2024 izzabizz5
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import "./hax-items.js"; //Gyatta import the items 

/**
 * `hax-search`
 * 
 * @demo index.html
 * @element hax-search
 */
export class HaxSearch extends DDDSuper(I18NMixin(LitElement)) {

  static get tag() {
    return "hax-search";
  }

  constructor() {
    super();
    this.siteUrl = "";
    this.overviewData = {};
    this.items = [];
    this.errorMessage = "";
    this.value = "";
  }

  // Lit reactive properties
  static get properties() {
    return {
      ...super.properties,
      siteUrl: { type: String, reflect: true },
      overviewData: { type: Object },
      items: { type: Array },
      errorMessage: { type: String },
      value: { type: String, reflect: true }
    };
  }

  static get styles() {
    return [
    ...super.styles,
    css`
      :host {
        display: block;
        padding: 1rem;
      }   
      .container {
        font-family: var(--ddd-font-navigation);
        max-width: 800px;
        margin: 0 auto;
        padding: var(--ddd-spacing-8);
        background-color: var(--simple-colors-default-theme-grey-1);
        color: var(--simple-colors-default-theme-accent-12);
      }
      .input-section {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-bottom: 1rem;
      }
      input[type="url"] {
        flex-grow: 1;
        padding: 4px;
        border: 1px solid var(--simple-colors-default-theme-grey-5);
        border-radius: 8px;
      }
      button {
        padding: 0.5rem 1rem;
        background-color: var(--simple-colors-default-theme-blue-7);
        color: var(--simple-colors-default-theme-grey-1);
        border: none;
        border-radius: var(--ddd-spacing-4);
      }
      button:hover {
        background-color: var(--simple-colors-default-theme-blue-6);
      }
      .overview {
        font-family: var(--ddd-font-navigation);
        border-left: 5px solid var(--simple-colors-default-theme-accent-5);
        padding: 1rem;
        background-color: var(--simple-colors-default-theme-grey-2);
        color: var(--simple-colors-default-theme-accent-12);
        margin-bottom: 1rem;
        text-align: left;
      }
      .card-container {
        font-family: var(--ddd-font-navigation);
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 6rem;
      }
      .error {
        color: var(--simple-colors-default-theme-red-6);
      }
    `];
  }

  connectedCallback() {
    super.connectedCallback();
    this.updateResults(); // Hopefully loads data when it's called to instead of searching and it loading
  }

  render() {
    return html`
      <div class="input-section">
        <input id="input" placeholder="Search Hax Pages" @input="${this.inputChanged}" />
        <button @click="${this.updateResults}">Analyze</button>
      
      </div>
      <div class="overview" style="border-left-color:${this.overviewData.hexCode}">
        ${this.overviewData.title ? html`
        <h2>${this.overviewData.title}</h2>
        ${this.overviewData.logo ? html`<img src="${this.overviewData.logo}" alt="Logo" style="max-width: 100px;">` : ''}
        <p><strong>Description:</strong> ${this.overviewData.description}</p>
        <p><strong>Created:</strong> ${new Date(this.overviewData.created * 1000).toLocaleDateString()}</p>
        <p><strong>Last Updated:</strong> ${new Date(this.overviewData.updated * 1000).toLocaleDateString()}</p>
      ` : html `<p>Loading overview data...</p>`}
      </div>
    
      <div class="card-container">
          ${this.items.length > 0
            ? this.items.map(item => html`
              <hax-items>
                <h2>${item.title}</h2>
                <p>${item.description}</p>
                <p><strong>Created:</strong> ${new Date(item.created * 1000).toLocaleDateString()}</p>
                <p><strong>Updated:</strong> ${new Date(item.updated * 1000).toLocaleDateString()}</p>
                ${item.image ? html`<img src="${item.image}" alt="${item.title}" />` : ''}
              </hax-items>
            `)
            : html`<p>No items found.</p>`}
      </div>`
  }

  inputChanged(e) {
    this.value = e.target.value;
    this.filterItems();
  }

  updated(changedProperties) {
    // When the value changes (user input)
    if (changedProperties.has('value')) {
      this.filterItems();
    }

    // Debugging the fetched items
    if (changedProperties.has('items') && this.items.length > 0) {
      console.log(this.items);
    }
  }

  async updateResults() {
    this.loading = true;
    this.errorMessage = ""; // Reset error before fetching
    try {
      const response = await fetch(`https://haxtheweb.org/site.json`);
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      
      // Store the overview data
      if (data.metadata && data.metadata.site) {
        this.overviewData = {
          title: data.metadata.site.name || '',
          description: data.description || '',
          logo: data.metadata.site.logo || '',
          created: data.metadata.site.created || 0,
          updated: data.metadata.site.updated || 0,
        };
      }

      // Map JSON data to component's items
      if (Array.isArray(data.items)) {
        this.items = data.items.map(item => ({
          title: item.title,
          description: item.description,
          slug: item.slug,
          updated: item.metadata.updated,
          created: item.metadata.created,
          image: item.metadata.images?.[0]?.url || "", // Use the first image if present
        }));
      } else {
        this.items = [];
      }

      // Filter items based on search
      this.filterItems();
    } catch (error) {
      this.errorMessage = error.message; // Set the error message for display
    } finally {
      this.loading = false;
    }
  }

  // Filter items based on the search value
  filterItems() {
    if (this.value.trim() === "") {
      this.filteredItems = this.items;
    } else {
      const searchQuery = this.value.toLowerCase();
      this.filteredItems = this.items.filter(item => 
        item.title.toLowerCase().includes(searchQuery) ||
        item.description.toLowerCase().includes(searchQuery)
      );
    }
  }

  static get haxProperties() {
    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url)
      .href;
  }
}

globalThis.customElements.define(HaxSearch.tag, HaxSearch);