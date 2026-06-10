// =============================================================================
//  Jenkinsfile — Declarative CI/CD Pipeline (Corrected Version)
// -----------------------------------------------------------------------------
//  Runs on any Jenkins agent. Make sure Node.js and npm are installed
//  in the environment where Jenkins executes.
// =============================================================================

pipeline {
    agent any

    environment {
        APP_NAME = 'cicd-demo-app'
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
