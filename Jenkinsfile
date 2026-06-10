// =============================================================================
//  Jenkinsfile — Declarative CI/CD Pipeline (Teaching Sample)
// -----------------------------------------------------------------------------
//  This file lives in the ROOT of your repository. Jenkins reads it
//  automatically when you create a "Pipeline" or "Multibranch Pipeline" job
//  pointed at this repo. Every push triggers the stages below in order.
//
//  CI  = Continuous Integration : checkout -> install -> lint -> test -> build
//  CD  = Continuous Delivery    : -> deploy to staging (here, on the main branch)
// =============================================================================

pipeline {

    // 'agent any' = run on any available Jenkins agent (node/executor).
    // In a real setup you might pin to a label, e.g. agent { label 'linux' }
    agent any

    // ---- Tools: NodeJS plugin manages the Node/npm installation ------------
    tools {
        nodejs 'NodeJS'   // must match the name set in Manage Jenkins > Tools > NodeJS
    }

    // ---- Environment variables available to every stage --------------------
    environment {
        APP_NAME     = 'cicd-demo-app'
        NODE_VERSION = '18'
        // Secrets are NEVER hard-coded. They are stored in
        // Jenkins > Manage Jenkins > Credentials and pulled in like this:
        // DEPLOY_KEY = credentials('staging-deploy-key')
    }

    // ---- Pipeline-wide options ---------------------------------------------
    options {
        timestamps()                                   // prefix log lines with a timestamp
        timeout(time: 30, unit: 'MINUTES')             // abort if it hangs
        buildDiscarder(logRotator(numToKeepStr: '10')) // keep only the last 10 builds
        disableConcurrentBuilds()                      // one run at a time per branch
    }

    // ---- The pipeline stages (run top to bottom) ---------------------------
    stages {

        stage('Checkout') {
            steps {
                echo "Checking out the source code..."
                checkout scm   // 'scm' = the repo configured on this Jenkins job
            }
        }

        stage('Install Dependencies') {
            steps {
                echo "Installing dependencies with a clean, reproducible install..."
                sh 'npm ci'    // 'npm ci' is faster + stricter than 'npm install' for CI
            }
        }

        // Lint and unit tests are independent, so we run them in PARALLEL to
        // save time. This is a great concept to demonstrate to students.
        stage('Quality & Tests') {
            parallel {
                stage('Code Quality (Lint)') {
                    steps {
                        echo "Running the linter..."
                        sh 'npm run lint'
                    }
                }
                stage('Unit Tests') {
                    steps {
                        echo "Running unit tests with coverage..."
                        sh 'npm test'
                    }
                    post {
                        // 'always' runs whether the tests pass or fail, so the
                        // report is published either way.
                        always {
                            junit testResults: 'reports/junit/*.xml',
                                  allowEmptyResults: true
                        }
                    }
                }
            }
        }

        stage('Build') {
            steps {
                echo "Packaging the application into a build artifact..."
                sh 'npm run build'
                // Save the built output so it can be downloaded from the build page
                archiveArtifacts artifacts: 'dist/**', allowEmptyArchive: true
            }
        }

        stage('Deploy to Staging') {
            steps {
                echo "Deploying ${APP_NAME} to the staging environment..."
                sh 'bash scripts/deploy.sh staging'
            }
        }
    }

    // ---- Post actions: run AFTER all stages, based on the result -----------
    post {
        success {
            echo "✅ Pipeline finished successfully."
            // e.g. slackSend / emailext could notify the team here
        }
        failure {
            echo "❌ Pipeline failed — check the stage logs above."
        }
        always {
            echo "Cleaning the workspace..."
            cleanWs()   // requires the "Workspace Cleanup" plugin
        }
    }
}
