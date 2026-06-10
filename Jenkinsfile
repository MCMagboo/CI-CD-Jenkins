pipeline {
    agent any

    environment {
        APP_NAME = 'ci-cd-jenkins-app'
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

        stage('Build Docker Image') {
            steps {
                script {
                    echo "Building Docker image from Dockerfile..."
                    dockerImage = docker.build("${APP_NAME}")
                }
            }
        }

        stage('Install & Test in Container') {
            steps {
                script {
                    dockerImage.inside {
                        echo "Installing dependencies..."
                        sh 'npm ci'

                        echo "Running linter..."
                        sh 'npm run lint'

                        echo "Running unit tests..."
                        sh 'npm test'
                    }
                }
            }
        }

        stage('Build App in Container') {
            steps {
                script {
                    dockerImage.inside {
                        echo "Packaging the application..."
                        sh 'npm run build'
                        archiveArtifacts artifacts: 'dist/**', allowEmptyArchive: true
                    }
                }
            }
        }

        stage('Deploy to Staging') {
            steps {
                script {
                    dockerImage.inside {
                        echo "Deploying ${APP_NAME} to staging..."
                        sh 'bash scripts/deploy.sh staging'
                    }
                }
            }
        }
    }

    post {
        success {
            echo "✅ Pipeline finished successfully."
        }
        failure {
            echo "❌ Pipeline failed — check the stage logs above."
        }
        always {
            echo "Cleaning the workspace..."
            cleanWs()
        }
    }
}
