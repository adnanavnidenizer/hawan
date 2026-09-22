# HAWAN store integration

commerce.json selects the build-time provider. Default coming-soon loads no payment scripts and makes no claims about prices or stock.

- shopier: set shopierUrl to the official HTTPS store or product URL. Host is validated. Both languages link to the hosted Shopier page.
- shopify: set shopifyEmbedFile to a reviewed HTML file inside this repository containing the merchant-generated Buy Button or collection embed. It renders inside #commerce-mount. Configure products, currency, language and cart in Shopify. Never commit Admin API tokens or private keys.

Actual checkout is not connected or tested: account details have not been provided. Before launch, verify products, prices, shipping, policies and payment flow on both languages and mobile.

Official references:
https://help.shopify.com/en/manual/online-sales-channels/buy-button/add-embed-code
https://help.shopier.com/help/musterilerim-dukkanimi-nasil-gorebilir

# Page editing

Home templates: index.html and index-tr.html. Other pages and shared navigation: generate-pages.cjs. Generated en/tr directories should not be edited manually. Run node build.cjs; dist contains the deployable site. Language switches preserve page type. Legacy URLs redirect through Cloudflare Pages _redirects. Main production remains unchanged pending approval.

## Shared local cart

js/cart.js and css/cart.css provide the shared drawer and /tr/sepet/ + /en/cart/ pages. All generated pages include a header cart entry. Home/store cards open a material/size selection panel; product detail buttons use the current selections and require a material. Identical model/material/size combinations share a quantity; different variants remain separate. Quantity range is 1–99.

Only validated model IDs, material keys, size and quantity are stored under hawan-cart-v1 in localStorage. This persists within the same browser and origin, across both languages. It does not sync across devices or domains. Storage events update other open tabs. When persistence is unavailable the current page retains an in-memory cart and announces the limitation.

No price, stock reservation, order or payment service is connected. Checkout remains disabled. Connecting a provider requires mapping each combination to real provider variant IDs and validating prices, stock, shipping and checkout server-side; the existing embed adapter does not automatically connect this cart.

Verified locally: card selection, material required on product detail, distinct variants, duplicate variant quantity, drawer-to-page navigation, persistence in a new tab, removal/empty state; 390px cart page has no horizontal overflow. Build and local route checks passed.
