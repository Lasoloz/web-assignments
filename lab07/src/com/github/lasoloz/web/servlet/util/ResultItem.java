/*
 * Heim László
 * hlim1626
 * lab07
 */
package com.github.lasoloz.web.servlet.util;

public class ResultItem {
    private char value;
    private boolean bold;

    public ResultItem(char value, boolean bold) {
        this.value = value;
        this.bold = bold;
    }

    public char getValue() {
        return value;
    }

    public boolean isBold() {
        return bold;
    }
}
