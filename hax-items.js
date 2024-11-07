import { LitElement, html, css } from "lit";

export class HaxItems extends LitElement {

  constructor() {
    super();
    this.title = "";
    this.description = "";
    this.updated = "";
    this.slug = "";
    this.imageURL = "";
  }

  static get properties() {
    return {
        title: { type: String },
        description: { type: String },
        updated: { type: String },
        slug: { type: String },
        imageURL: { type: String} ,
    };
  }

  static get styles() {
    return [super.styles,
    css`
      .card {
        border: 1px solid var(--simple-colors-default-theme-grey-5);
        border-radius: 6px;
        padding: 10px;
        background-color: var(--simple-colors-default-theme-grey-1);
        color: var(--simple-colors-default-theme-accent-12);
        text-align: left;
        box-shadow: 0 4px 8px var(--simple-colors-default-theme-grey-6);
      }
      .card h3 {
        font-size: 1.1em;
        margin: 0;
        color: var(--simple-colors-default-theme-accent-8);
      }
      .card p {
        font-size: 0.9em;
        color: var(--simple-colors-default-theme-grey-9);
      }
      .card img {
        width: 100%;
        height: auto;
        border-radius: 4px;
        margin-bottom: 10px;
      }
      .card a {
        color: var(--simple-colors-default-theme-blue-6);
        text-decoration: none;
        margin-right: 5px;
      }
      .card a:hover {
        color: var(--simple-colors-default-theme-blue-8);
        text-decoration: underline;
      }
    `];
  }

  render() {
    return html`
      <div class="item">
        <h3>${this.title}</h3>
        <img src="${this.imageUrl}" alt="Image for ${this.title}">
        <p>${this.description}</p>
        <p><strong>Last Updated:</strong> ${this.updated}</p>
        <a href="${this.slug}" target="_blank">Open Content</a> |
        <a href="${this.slug}/index.html" target="_blank">Open Source</a>
      </div>
    `;
  }
  static get tag() {
    return "hax-items";
  }
}
customElements.define(HaxItems.tag, HaxItems);