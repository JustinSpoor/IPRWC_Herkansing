FROM maven:3.9.4 AS build

WORKDIR /app

COPY pom.xml .

RUN mvn dependency:go-offline

COPY src /app/src

RUN mvn clean package -DskipTests

FROM openjdk:17-jdk-slim

WORKDIR /app

COPY --from=build /app/target/*.jar /app/backend.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "/app/backend.jar"]