FROM openjdk:8-jdk-alpine
ARG JAR_FILE=target/zuul-1.0.jar
COPY ${JAR_FILE} zuul-1.0.jar
ENTRYPOINT ["java","-jar","/zuul-1.0.jar"]