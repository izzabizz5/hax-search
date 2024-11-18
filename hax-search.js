/**
 * Copyright 2024 izzabizz5
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import '@haxtheweb/simple-icon/simple-icon.js';
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
    this.siteURL = "";
    this.items = [];
    this.filteredItems = [];
    this.errorMessage = "";
    this.value = "";
    this.color = "";
    this.loading = false;
    this.logoImage = "";
    this.webIcon = "";
    this.site = "";
  }

  // Lit reactive properties
  static get properties() {
    return {
      ...super.properties,
      siteURL: { type: String, attribute: 'json-url' },
      items: { type: Array },
      filteredItems: { type: Array },
      errorMessage: { type: String },
      value: { type: String, reflect: true },
      color: { type: String},
      loading: { type: Boolean, reflect: true },
      logoImage: { type: String },
      webIcon: { type: String },
      site: { type: String },
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

      input {
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
        padding: var(--ddd-spacing-2);
        background-color: var(--ddd-accent-3);
        color: var(--ddd-primary-4);
        margin-bottom: var(--ddd-spacing-12);
      }
      .overview-title {
        display: inline-flex;
        margin: var(--ddd-spacing-4);
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
        max-width: 250x;
        max-height: 250px;
        border-radius: var(--ddd-radius-sm);
      }
      .card-container {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: var(--ddd-spacing-10);
      }
      .card-container:hover a {
        text-decoration:none!important;
      }
      #hax2022icon {
        max-height: 100px;
        max-width: 100px;
        padding: var(--ddd-spacing-2);
      }
      h2 {
        padding: var(--ddd-spacing-2);
        font-size: var(--ddd-font-size-m);
        margin: 0;
      } 
      p {
        margin: var(--ddd-spacing-) 0;
        font-size: var(--ddd-font-size-3xs);
        line-height: var(--ddd-lh-150);
      }
      .error-message {
      color: var(--ddd-primary-22);
      background-color: var(--ddd-accent-3);
      padding: var(--ddd-spacing-4);
      border-radius: var(--ddd-radius-sm);
      margin-bottom: var(--ddd-spacing-4);
    }

    `];
  }

  render() {
    return html`
      <div class="input-section">
        <input id="input" placeholder="https://haxtheweb.org/" @input="${this.inputChanged}"/>
        <button @click="${this.updateResults}">Analyze</button>
      </div>

      ${this.errorMessage
      ? html`<div class="error-message">${this.errorMessage}</div>`
      : ''}

      ${!this.errorMessage && this.title
        ? html`
            <div class="overview" style="border: solid ${this.color} 2px">
              <div class="overview-title">
                <simple-icon id="hax2022icon" src=${this.webIcon}></simple-icon>
                <h2>${this.title}</h2>
              </div>
              <div class="overview-content">
                <img src="${this.logoImage}" alt="${this.title}" />
                <div class="overview-text">
                  <p><strong>Description:</strong> ${this.description}</p>
                  <p><strong>Theme: </strong>${this.haxTheme}</p>
                  <p><strong>Created:</strong> ${new Date(this.created * 1000).toLocaleDateString()}</p>
                  <p><strong>Last Updated:</strong> ${new Date(this.updatedDate * 1000).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          `
        : ''}
    
      <div class="card-container">
          ${this.filteredItems.length > 0
            ? this.filteredItems.map(item => html`
            <a href = "${item.contentLink}" target="_blank">
              <hax-items
                title="${item.title}"
                imageURL="${item.imageURL}"
                description="${item.description}"
                contentLink="${item.contentLink}"
                openSourceLink="${item.openSourceLink}"
                updatedDate="${new Date(item.updatedDate * 1000).toLocaleDateString()}"
                color="${this.color}"
                isPublished="${item.isPublished}"
                >
              </hax-items>
            </a>
            `)
            : html`<p>No items found.</p>`}
      </div>`      
  }

  inputChanged(e) {
    this.value = this.shadowRoot.querySelector('#input').value.trim();
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
    this.clearData();
    this.errorMessage = ""; // Reset error before fetching
  
    this.siteURL = this.value.replace("site.json","");
    if(!this.siteURL.endsWith("/")) {
      this.siteURL += "/";
    }

    fetch(this.siteURL + "site.json")
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        return response.json();
      })
      .then(data => {
        // Store the overview data
        if (data) {
          this.title = data.metadata.site.name;
          this.description = data.description;
          this.haxTheme = data.metadata.theme.name;
          this.color = data.metadata.theme.variables.hexCode;
          this.created = data.metadata.site.created;
          this.updatedDate = data.metadata.site.updated;
          this.logoImage = this.siteURL + data.metadata.site.logo;
          this.webIcon = data.metadata.theme.variables.icon
        } else {
          this.errorMessage = 'Invalid data format';
        }

      // Map JSON data to component's items
      if (Array.isArray(data.items)) {
        this.items = data.items.map(item => ({
          title: item.title,
          description: item.description,
          slug: item.slug,
          updatedDate: item.metadata.updated,
          contentLink: this.siteURL + item.slug,
          openSourceLink: this.siteURL + item.location,
          imageURL: item.metadata.files ? this.siteURL + item.metadata.files[0].url : "https://haxtheweb.org/files/hax%20(1).png",
          isPublished: item.metadata.published ? "Published" : "Not Published",
        }));
        this.filteredItems = this.items;
      } else {
        this.errorMessage = 'No Items';
      }
    })
    .catch(error => {
      this.errorMessage = `Failed to load data: ${error.message}`;
      this.clearData();
    })
    .finally(() => {
      this.loading = false;
    });
  }
      
  clearData() {
    this.title = "";
    this.description = "";
    this.haxTheme = "";
    this.color = "";
    this.created = null;
    this.updatedDate = null;
    this.logoImage = "";
    this.filteredItems = [];
    this.items = [];
  }

  filterItems() {
    if (!this.value.startsWith(this.siteURL)) {
      this.filteredItems = []
    } else {
      const searchQuery = this.value.replace(this.siteURL, "").toLowerCase();
      this.filteredItems = this.items.filter(item => 
        item.slug.toLowerCase().includes(searchQuery)
      );
    }
  }

   
  static get haxProperties() {
    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url)
      .href;
  }
}

globalThis.customElements.define(HaxSearch.tag, HaxSearch);