FROM openjdk:8-jdk-alpine
ARG JAR_FILE=target/services-auth-1.0.jar
COPY ${JAR_FILE} services-auth-1.0.jar
ENTRYPOINT ["java","-jar","/services-auth-1.0.jar"]