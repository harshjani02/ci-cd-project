pipeline {
    agent any

    tools {
        nodejs 'NodeJS-22'
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            parallel {

                stage('Backend Dependencies') {
                    steps {
                        dir('backend') {
                            sh 'node --version'
                            sh 'npm --version'
                            sh 'npm ci'
                        }
                    }
                }

                stage('Frontend Dependencies') {
                    steps {
                        dir('frontend') {
                            sh 'node --version'
                            sh 'npm --version'
                            sh 'npm ci'
                        }
                    }
                }
            }
        }

        stage('Frontend Lint') {
            steps {
                dir('frontend') {
                    sh 'npm run lint || true'
                }
            }
        }

        stage('Frontend Build') {
            steps {
                dir('frontend') {
                    sh 'npm run build'
                }
            }
        }

        stage('Build Docker Images') {
            steps {
                sh 'docker built -t task-manager-backend:ci ./backend'
                sg 'docker built -t task-manager-frontend:ci ./frontend'
            }
        }

        stage('Verify Project') {
            steps {
                sh 'pwd'
                sh 'ls -la'
                sh 'ls -la backend'
                sh 'ls -la frontend'
            }
        }
    }
}