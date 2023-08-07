FROM openjdk:8-jdk-alpine
ARG JAR_FILE=target/services-group-1.0.jar
COPY ${JAR_FILE} services-group-1.0.jar
ENTRYPOINT ["java","-jar","/services-group-1.0.jar"]