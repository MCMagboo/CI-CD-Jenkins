pipeline {
    agent {
        docker {
            image 'node:18-bullseye'   // Debian-based Node image includes libatomic
            args '-u root:root'        // Run as root to avoid permission issues
        }
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
                echo "Checking out source code..."
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                echo "Installing dependencies..."
                sh 'npm ci'
            }
        }

        stage('Lint') {
            steps {
                echo "Running lint..."
                sh 'npm run lint'
            }
        }

        stage('Test') {
            steps {
                echo "Running unit tests..."
                sh 'npm test'
            }
        }

        stage('Build') {
            steps {
                echo "Building application..."
                sh 'npm run build'
                archiveArtifacts artifacts: 'dist/**', allowEmptyArchive: true
            }
        }

        stage('Deploy to Staging') {
            steps {
                echo "Deploying to staging..."
                sh 'bash scripts/deploy.sh staging'
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
            echo "Cleaning workspace..."
            cleanWs()
        }
    }
}
