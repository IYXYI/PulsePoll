# Developer setup

1) Create a Cloudflare API token

- Go to https://dash.cloudflare.com/profile/api-tokens
- Create a token with at least: "Workers Scripts: Edit", "Account.KV: Read" and "Account.KV: Write".
- Save the token value.

2) Create a KV namespace

Using wrangler (install wrangler v2):

```bash
# login (optional)
wrangler login

# create namespace
wrangler kv:namespace create "POLLS"
# this prints the KV namespace id; copy it for the repo secret CF_KV_NAMESPACE_ID
```

3) Add GitHub secrets (Repository settings -> Secrets -> Actions)

- CF_API_TOKEN: the token you created
- CF_ACCOUNT_ID: (optional but used by wrangler) your account id
- CF_KV_NAMESPACE_ID: the KV namespace id created above
- (Optionally) VITE_API_URL: the published worker URL; the combined workflow injects it automatically after worker publish

Note: newer Wrangler/Cloudflare actions expect the secret name `CLOUDFLARE_API_TOKEN`. The workflows accept either `CLOUDFLARE_API_TOKEN` or the older `CF_API_TOKEN`. Prefer adding `CLOUDFLARE_API_TOKEN`.

4) Local development

- Frontend:
  - cd frontend
  - npm install
  - npm run dev

- Worker:
  - cd wrangler
  - npm install
  - npx wrangler dev

5) Run tests

- Frontend tests:
  - cd frontend
  - npm test

- Worker tests (Miniflare):
  - cd wrangler
  - npm test
