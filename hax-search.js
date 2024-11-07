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
    this.title = "";
    this.t = this.t || {};
    this.t = {
      ...this.t,
      title: "Title",
    };
    this.registerLocalization({
      context: this,
      localesPath:
        new URL("./locales/hax-search.ar.json", import.meta.url).href +
        "/../",
      locales: ["ar", "es", "hi", "zh"],
    });
    this.siteUrl = "";
    this.overviewData = {};
    this.items = [];
    this.errorMessage = "";
  }

  // Lit reactive properties
  static get properties() {
    return {
      ...super.properties,
      siteUrl: { type: String },
      overviewData: { type: Object },
      items: { type: Array },
      errorMessage: { type: String }
    };
  }

  static get styles() {
    return [super.styles,
    css`
      .container {
        max-width: 800px;
        margin: 0 auto;
        padding: 1rem;
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
        padding: 0.5rem;
        border: 1px solid var(--simple-colors-default-theme-grey-5);
        border-radius: 4px;
      }
      button {
        padding: 0.5rem 1rem;
        background-color: var(--simple-colors-default-theme-blue-7);
        color: var(--simple-colors-default-theme-grey-1);
        border: none;
        border-radius: 4px;
      }
      button:hover {
        background-color: var(--simple-colors-default-theme-blue-6);
      }
      .overview {
        border-left: 5px solid var(--simple-colors-default-theme-accent-5);
        padding: 1rem;
        background-color: var(--simple-colors-default-theme-grey-2);
        color: var(--simple-colors-default-theme-accent-12);
        margin-bottom: 1rem;
        text-align: left;
      }
      .card-container {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
        gap: 1rem;
      }
      .error {
        color: var(--simple-colors-default-theme-red-6);
      }
    `];
  }

  render() {
    return html`
      <div class="input-section">
        <input id="input" placeholder="Search Hax Pages" @input="${this.inputChanged}" />
        <button @click="${this.updateResults}">Analyze</button>
      </div>
      <div class="overview">
      ${this.overviewData.title ? html`
          <div class="overview" style="border-left-color:${this.overviewData.hexCode}">
            <h2>${this.overviewData.title}</h2>
            ${this.overviewData.logo ? html`<img src="${this.overviewData.logo}" alt="Logo" style="max-width: 100px;">` : ''}
            <p><strong>Description:</strong> ${item.data[0].description}</p>
            <p><strong>Theme:</strong> ${item.data[0].theme}</p>
            <p><strong>Created:</strong> ${item.data[0].created}</p>
            <p><strong>Last Updated:</strong> ${item.data[0].updated}</p>
          </div> 
      ` : ''}
      </div>
          <div class="card-container">
             ${Array.isArray(this.items) && this.items.length > 0 ? this.items.map(item => html`
              <a href="${item.links[0].href}" target="_blank">
                <hax-card
                  title="${item.data[0].title}"
                  description="${item.data[0].description}"
                  updated="${item.data[0].updated}"
                  slug="${item.data[0].slug}"
                  imageUrl="${item.metadata?.image}"
                ></hax-card>
              </a>
            `) : html`<p>No items found.</p>`}
          </div>`;
  }

  inputChanged(e) {
    this.value = this.shadowRoot.querySelector('#input').value;
  }
  // life cycle will run when anything defined in `properties` is modified
  updated(changedProperties) {
    // see if value changes from user input and is not empty
    if (changedProperties.has('value') && this.value) {
      this.updateResults(this.value);
    }
    else if (changedProperties.has('value') && !this.value) {
      this.items = [];
    }
    // debugging
    if (changedProperties.has('items') && this.items.length > 0) {
      console.log(this.items);
    }
  }

  async updateResults(value) {
    this.loading = true;
    try {
      const response = await fetch(`https://haxtheweb.org/site.json`);
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      if (data.collection) {
        this.items = data.collection.items;
      }  
    } catch (error) {
      this.errorMessage = error.message; // Handle the error error
    } finally {
      this.loading = false;
    }
  }

    static get tag() {
      return "hax-search";
    }

  static get haxProperties() {
    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url)
      .href;
  }
}

globalThis.customElements.define(HaxSearch.tag, HaxSearch);