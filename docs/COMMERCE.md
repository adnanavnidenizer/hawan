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
