FROM openjdk:8-jdk-alpine
ARG JAR_FILE=target/services-user-1.0.jar
COPY ${JAR_FILE} services-user-1.0.jar
ENTRYPOINT ["java","-jar","/services-user-1.0.jar"]