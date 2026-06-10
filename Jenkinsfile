pipeline {
    agent any

    environment {
        IMAGE_NAME = "ci-cd-jenkins-app"
    }

    stages {
        stage('Checkout') {
            steps {
                echo "Checking out source code..."
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    echo "Building Docker image from Dockerfile..."
                    dockerImage = docker.build("${IMAGE_NAME}")
                }
            }
        }

        stage('Install Dependencies & Tests') {
            steps {
                script {
                    dockerImage.inside {
                        echo "Installing dependencies..."
                        sh 'npm ci'

                        echo "Running lint..."
                        sh 'npm run lint'

                        echo "Running unit tests..."
                        sh 'npm test'
                    }
                }
            }
        }

        stage('Build App') {
            steps {
                script {
                    dockerImage.inside {
                        echo "Building application..."
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
                        echo "Deploying to staging..."
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
            echo "❌ Pipeline failed — check logs above."
        }
        always {
            cleanWs()
        }
    }
}
