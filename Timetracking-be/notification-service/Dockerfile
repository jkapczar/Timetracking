FROM openjdk:8-jdk-alpine
ARG JAR_FILE=target/services-notification-1.0.jar
COPY ${JAR_FILE} services-notification-1.0.jar
ENTRYPOINT ["java","-jar","/services-notification-1.0.jar"]