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

        stage('Get Git Commit') {
            steps {
                sh 'git rev-parse --short HEAD'
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
                sh 'docker build -t task-manager-backend:ci ./backend'
                sh 'docker build -t task-manager-frontend:ci ./frontend'
            }
        }

        stage('Tag Images for ECR') {
            steps {
                sh '''
                    docker tag task-manager-backend:ci \
                    881174216441.dkr.ecr.ap-south-1.amazonaws.com/task-manager-backend:v1

                    docker tag task-manager-frontend:ci \
                    881174216441.dkr.ecr.ap-south-1.amazonaws.com/task-manager-frontend:v1
                '''
            }
        }   

        stage('Login to ECR') {
            steps {
                withCredentials([
                    usernamePassword(
                        credentialsId: 'aws-ecr-credentials',
                        usernameVariable: 'AWS_ACCESS_KEY_ID',
                        passwordVariable: 'AWS_SECRET_ACCESS_KEY'
                    )
                ]) {
                    sh '''
                        aws ecr get-login-password --region ap-south-1 | \
                        docker login --username AWS --password-stdin \
                        881174216441.dkr.ecr.ap-south-1.amazonaws.com
                    '''
                }
            }
        }

        stage('Push Image to ECR'){
            steps {
                sh '''
                    docker push 881174216441.dkr.ecr.ap-south-1.amazonaws.com/task-manager-backend:v1
                    docker push 881174216441.dkr.ecr.ap-south-1.amazonaws.com/task-manager-frontend:v1


                '''
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