FROM openjdk:8-jdk-alpine
ARG JAR_FILE=target/server-1.0.jar
COPY ${JAR_FILE} server-1.0.jar
ENTRYPOINT ["java","-jar","/server-1.0.jar"]