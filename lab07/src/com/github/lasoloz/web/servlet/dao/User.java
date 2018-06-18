/*
 * Heim László
 * hlim1626
 * lab07
 */
package com.github.lasoloz.web.servlet.dao;

import org.bson.types.ObjectId;

public final class User {
    private ObjectId id;
    private String name;
    private String password; // This should be hashed!

    public User() {
    }

    public ObjectId getId() {
        return id;
    }

    public void setId(ObjectId id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", password='" + password + '\'' +
                '}';
    }
}