# Jenkins CI/CD Pipeline — Class Demo

A minimal but realistic project for teaching a **Jenkins CI/CD pipeline**. It
contains a tiny Node.js/Express app plus a `Jenkinsfile` that takes the code
through the full pipeline: **checkout → install → lint → test → build → deploy**.

```
jenkins-cicd-demo/
├── Jenkinsfile            # the pipeline definition (the star of the show)
├── package.json           # scripts the pipeline runs: lint, test, build, start
├── jest.config.js         # test runner config (emits JUnit report + coverage)
├── .eslintrc.json         # lint rules
├── src/
│   ├── app.js             # the Express app + a testable add() function
│   └── server.js          # starts the HTTP server
├── test/
│   └── app.test.js        # unit + endpoint tests
├── scripts/
│   ├── build.js           # produces a dist/ artifact
│   └── deploy.sh          # simulated deployment step
├── .vscode/
│   ├── extensions.json    # recommended VSCode extensions
│   └── settings.json      # workspace settings + Jenkinsfile linter config
└── .gitignore
```

## Prerequisites

- **Node.js 18+** and npm
- **Git**
- **Jenkins** (Long-Term Support release) with these plugins: *Pipeline*,
  *Git*, *JUnit*, and *Workspace Cleanup*
- **VSCode**

## Run it locally first (no Jenkins needed)

Doing this by hand helps students see what each pipeline stage actually does.

```bash
npm ci          # install dependencies
npm run lint    # the "Code Quality" stage
npm test        # the "Unit Tests" stage (creates reports/)
npm run build   # the "Build" stage (creates dist/)
npm start       # run the app -> http://localhost:3000/health
```

## What the pipeline does (stage by stage)

| Stage | Command | Purpose |
|-------|---------|---------|
| Checkout | `checkout scm` | Pull the latest code from the repo |
| Install Dependencies | `npm ci` | Clean, reproducible dependency install |
| Code Quality (Lint) | `npm run lint` | Catch style/syntax problems early |
| Unit Tests | `npm test` | Verify behavior; publish a JUnit report |
| Build | `npm run build` | Package the app into a `dist/` artifact |
| Deploy to Staging | `./scripts/deploy.sh` | Ship it — **only on the `main` branch** |

Lint and tests run **in parallel** to save time, and the `post` block always
cleans the workspace and reports success or failure.

## Connect it to Jenkins

1. Push this project to a Git repository (GitHub, GitLab, etc.).
2. In Jenkins: **New Item → Pipeline** (or **Multibranch Pipeline**) → OK.
3. Under **Pipeline**, choose **Pipeline script from SCM**, set **SCM = Git**,
   and paste your repo URL. Script Path stays as `Jenkinsfile`.
4. Save, then **Build Now**. Watch the stages run in the **Stage View**.
5. (Optional) Add a webhook so every `git push` triggers a build automatically.

> Real secrets (deploy keys, tokens) go in **Manage Jenkins → Credentials**,
> never in the `Jenkinsfile`. The file shows the `credentials('...')` pattern in
> a comment.

## VSCode workflow

1. Open this folder in VSCode. Accept the prompt to install the
   **recommended extensions** (or run *"Extensions: Show Recommended
   Extensions"*).
2. The **Jenkinsfile Support** extension gives syntax highlighting for the
   pipeline.
3. The **Jenkins Pipeline Linter Connector** validates your `Jenkinsfile`
   against a real Jenkins server *before* you push. Edit the server URL in
   `.vscode/settings.json`, then run *"Validate Jenkinsfile"* from the Command
   Palette (`Ctrl/Cmd+Shift+P`).
4. **ESLint** underlines lint issues inline, so they're fixed before the
   pipeline ever runs.

## Ideas to extend it (good class exercises)

- Add a `develop` branch that deploys to a different environment.
- Add a **manual approval** gate before production using `input`.
- Containerize the app and push a Docker image in the Build stage.
- Add a coverage threshold that fails the build if coverage drops.
