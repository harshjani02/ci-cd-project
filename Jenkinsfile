pipeline{
    agent any

    stages{
        stage('checkout'){
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            parallel {
                stage('Backend Dependencies') {
                    steps {
                        dir('backend') {
                            sh 'npm ci'
                        }
                    }
                }

                stage('Frontend Dependencies') {
                    steps {
                        dir('frontend') {
                            sh 'npm ci'
                        }
                    }

                }
            }
        }
        stage('Verify Project') {
            steps {
                sh 'pwd'
                sh 'ls -la'
                sh 'sh -la backend'
                sh 'sh -la frontend'
            }
        }
    }
}