package com.github.lasoloz.web.servlet.dao;

import ch.qos.logback.classic.Level;
import ch.qos.logback.classic.Logger;
import ch.qos.logback.classic.LoggerContext;
import com.mongodb.MongoException;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import org.bson.codecs.configuration.CodecRegistries;
import org.bson.codecs.configuration.CodecRegistry;
import org.bson.codecs.pojo.PojoCodecProvider;
import org.slf4j.LoggerFactory;

import java.util.logging.LogManager;

public class DBProvider {
    private static DBProvider instance;
    private MongoClient client;
    private MongoDatabase userDb;
    private MongoCollection<User> collection;

    private DBProvider() {
        // Create client:
        client = MongoClients.create();

        CodecRegistry pojoCodecRegistry = CodecRegistries.fromRegistries(
                com.mongodb.MongoClient.getDefaultCodecRegistry(),
                CodecRegistries.fromProviders(PojoCodecProvider.builder()
                        .automatic(true).build())
        );

        userDb = client.getDatabase("lab06")
                .withCodecRegistry(pojoCodecRegistry);

        collection = userDb.getCollection("users", User.class);

        // Disable logging:
        LoggerContext context = (LoggerContext) LoggerFactory
                .getILoggerFactory();
        Logger rootLogger = context.getLogger("org.mongodb.driver");
        rootLogger.setLevel(Level.OFF);
    }

    public MongoDatabase getUserDb() {
        return userDb;
    }

    public MongoCollection<User> getUserCollection() {
        return collection;
    }

    public void close() {
        client.close();
    }


    public static DBProvider getInstance() {
        if (instance == null) {
            instance = new DBProvider();
        }

        return instance;
    }
}
