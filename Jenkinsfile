pipeline {
    agent any

    options {
        timestamps()
        timeout(time: 30, unit: 'MINUTES')
        buildDiscarder(logRotator(numToKeepStr: '10'))
        disableConcurrentBuilds()
    }

    stages {

        stage('Checkout') {
            steps {
                echo "Checking out source code..."
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                echo "Installing dependencies..."
                bat 'npm ci'
            }
        }

        stage('Lint') {
            steps {
                echo "Running lint..."
                bat 'npm run lint'
            }
        }

        stage('Test') {
            steps {
                echo "Running unit tests..."
                bat 'npm test'
            }
        }

        stage('Build') {
            steps {
                echo "Building application..."
                bat 'npm run build'
                archiveArtifacts artifacts: 'dist/**', allowEmptyArchive: true
            }
        }

        stage('Deploy to Staging') {
            steps {
                echo "Deploying to staging..."
                bat 'bash scripts/deploy.sh staging'
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
            script {
                try {
                    echo "Cleaning workspace..."
                    cleanWs()
                } catch (e) {
                    echo "Workspace cleanup skipped."
                }
            }
        }
    }
}
