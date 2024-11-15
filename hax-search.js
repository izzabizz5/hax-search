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
    this.siteURL = `https://haxtheweb.org/site.json`;
    this.overviewData = {};
    this.items = [];
    this.errorMessage = "";
    this.value = "";
    this.loading = false;
    this.logoImage = `https://haxtheweb.org/files/hax%20(1).png`;

  }

  // Lit reactive properties
  static get properties() {
    return {
      ...super.properties,
      siteURL: { type: String, attribute: 'json-url' },
      baseURL: { type: String},
      overviewData: { type: Object },
      items: { type: Array },
      errorMessage: { type: String },
      value: { type: String, reflect: true },
      loading: { type: Boolean, reflect: true },
    };
  }

  static get styles() {
    return [super.styles,
    css`
      :host {
        display: block;
        padding: var(--ddd-spacing-8);
      }
      .container {
        font-family: var(--ddd-font-navigation);
        max-width: 800px;
        margin: 0 auto;
        padding: var(--ddd-spacing-8);
        background-color: var(--ddd-accent-6); 
        color: var(--ddd-primary-4); 
        box-shadow: var(--ddd-boxShadow-sm);
        border-radius: var(--ddd-radius-md);
        border-width: var(--ddd-border-md);
        transition: transform 0.3s, box-shadow 0.3s;
      }
      .container:hover {
        transform: translateY(-5px);
        box-shadow: var(--ddd-boxShadow-md);
      }

      .input-section {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: var(--ddd-spacing-4);
        margin-bottom: var(--ddd-spacing-10);
      }

      input[type="url"] {
        flex-grow: 1;
        padding: var(--ddd-spacing-4);
        border: var(--ddd-border-sm);
        border-radius: var(--ddd-radius-sm);
        font-size: var(--ddd-font-size-3xs);
        width: calc(100% - var(--ddd-spacing-8));
      }

      button {
        padding: var(--ddd-spacing-4) var(--ddd-spacing-8);
        background-color: var(--ddd-primary-8);
        color: var(--ddd-accent-6);
        border: none;
        border-radius: var(--ddd-radius-sm);
        font-size: var(--ddd-font-size-3xs);
      cursor: pointer;
        transition: background-color 0.3s;
      }

      button:hover {
        background-color: var(--ddd-primary-7);
      }

      .overview {
        display: block;
        gap: var(--ddd-spacing-4);
        font-family: var(--ddd-font-navigation);
        border-radius: var(--ddd-radius-md);
        padding: var(--ddd-spacing-6);
        background-color: var(--ddd-accent-3);
        color: var(--ddd-primary-4);
        margin-bottom: var(--ddd-spacing-12);
      }
      .overview-title {
        margin-bottom: var(--ddd-spacing-4);
      }
      .overview-content {
        display: flex;
        gap: var(--ddd-spacing-6);
        align-items: flex-start;
      }
      .overview-text {
        display: flex;
        flex-direction: column;
      }
      .overview img {
        max-width: 120px;
        max-height: 120px;
        border-radius: var(--ddd-radius-sm);
      }
      .card-container {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: var(--ddd-spacing-10);
      }
      h2 {
        margin: 0 0 var(--ddd-spacing-3) 0;
        font-size: var(--ddd-font-size-m);
      } 
      p {
        margin: var(--ddd-spacing-3) 0;
        font-size: var(--ddd-font-size-3xs);
        line-height: var(--ddd-lh-150);
      }
      .error {
        color: var(--ddd-primary-22);
      }

    `];
  }

  render() {
    return html`
      <div class="input-section">
        <input id="input" placeholder="https://haxtheweb.org/site.json" @input="${this.inputChanged}"/>
        <button @click="${this.updateResults}">Analyze</button>
      </div>

      <div class="overview" style="border-color:${this.overviewData.hexCode}">
        ${this.title ? html`
        <h2 class="overview-header">${this.title}</h2>
        <div class="overview-content">
          <img src="${this.logoImage}" alt="${this.title}">
          <div class="overview-text">
            <p><strong>Description:</strong> ${this.description}</p>
            <p><strong>Theme: </strong>${this.haxTheme}</p>
            <p><strong>Created:</strong> ${new Date(this.created * 1000).toLocaleDateString()}</p>
            <p><strong>Last Updated:</strong> ${new Date(this.updatedDate * 1000).toLocaleDateString()}</p>
          </div>
        </div>
        ` : html`<p>Loading overview data...</p>`}
      </div>
    
      <div class="card-container" style="border-color:${this.overviewData.hexCode}">
          ${this.items.length > 0
            ? this.items.map(item => html`
            <a href = "${this.value}/${item.slug}" target="_blank">
              <hax-items 
                title="${item.title}"
                image="${item.imageURL ? html`<img src="${item.imageURL}" alt="${item.title}" />` : ''}"
                description="${item.description}"
                contentlink="${this.value}/${item.slug}" target="_blank"
                openSourceLink="${this.value}/${item.location}" target="_blank"
                updatedDate="${new Date(item.updatedDate * 1000).toLocaleDateString()}"
                baseURL="${item.baseURL}"
                >
              </hax-items>
            </a>
            `)
            : html`<p>No items found.</p>`}
      </div>`
  }

  inputChanged(e) {
    this.value = this.shadowRoot.querySelector('#input').value;
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

  updateResults() {
    this.loading = true;
    this.errorMessage = ""; // Reset error before fetching
    fetch(`https://haxtheweb.org/site.json`).then (d=> d.ok ? d.json(): {}).then(data => {
      // Store the overview data
      if (data) {
        this.title = data.metadata.site.name;
        this.logo = data.metadata.site.logoImage;
        this.description =  data.description;
        this.haxTheme = data.metadata.theme.name;
        this.created = data.metadata.site.created;
        this.updatedDate = data.metadata.site.updated;
      }
      else {
        console.log(this.errorMessage)
      }
      
      // Map JSON data to component's items
      if (Array.isArray(data.items)) {
        this.items = data.items.map(item => ({
          title: item.title,
          description: item.description,
          slug: item.slug,
          updatedDate: item.metadata.updated,
          contentLink: this.value + '/' + item.slug,
          openSourceLink: this.value + '/' + item.location,
          imageURL: item.metadata.files?.[0]?.fullUrl, // Use the first image if present
        }));
      } else {
        this.items = [];
      }
    })
  }
      
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