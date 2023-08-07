FROM openjdk:8-jdk-alpine
ARG JAR_FILE=target/services-calendar-1.0.jar
COPY ${JAR_FILE} services-calendar-1.0.jar
ENTRYPOINT ["java","-jar","/services-calendar-1.0.jar"]