# CSS Basics

## What is CSS?
CSS makes HTML look good - like painting and decorating the house.

## Key Concepts:

### 1. Selectors
- `#idName` - selects element with that id
- `.className` - selects elements with that class
- `elementName` - selects all elements of that type

### 2. Common Properties
- `color` - text color
- `background-color` - background color
- `padding` - space inside element
- `margin` - space outside element
- `display: flex` - makes children arrange in row/column
- `border` - border around element

### 3. How to Add CSS
- Inline: `<div style="color: red;">`
- In `<style>` tag in `<head>`
- External file: `<link rel="stylesheet" href="style.css">`

### Example:
#myButton {
    background-color: blue;
    color: white;
    padding: 10px 20px;
    border: none;
}