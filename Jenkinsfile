// =============================================================================
//  Jenkinsfile — Declarative CI/CD Pipeline (Fixed Version)
// -----------------------------------------------------------------------------
//  Runs inside a Node 18 Docker image, so npm commands work without Jenkins
//  needing the NodeJS plugin. Every push triggers the stages below in order.
// =============================================================================

pipeline {

    // Run all stages inside a Node 18 container
    agent {
        docker { image 'node:18' }
    }

    environment {
        APP_NAME     = 'cicd-demo-app'
    }

    options {
        timestamps()
        timeout(time: 30, unit: 'MINUTES')
        buildDiscarder(logRotator(numToKeepStr: '10'))
        disableConcurrentBuilds()
    }

    stages {

        stage('Checkout') {
            steps {
                echo "Checking out the source code..."
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                echo "Installing dependencies..."
                sh 'npm ci'
            }
        }

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
                        echo "Running unit tests..."
                        sh 'npm test'
                    }
                    post {
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
                echo "Packaging the application..."
                sh 'npm run build'
                archiveArtifacts artifacts: 'dist/**', allowEmptyArchive: true
            }
        }

        stage('Deploy to Staging') {
            steps {
                echo "Deploying ${APP_NAME} to staging..."
                sh 'bash scripts/deploy.sh staging'
            }
        }
    }

    post {
        success {
            echo "✅ Pipeline finished successfully."
        }
        failure {
            echo "❌ Pipeline failed — check the logs above."
        }
        always {
            echo "Cleaning the workspace..."
            cleanWs()
        }
    }
}
