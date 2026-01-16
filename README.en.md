# Agilebot Intelligent Palletizing Planning System

**Version v7.4.0 | Updated: January 16, 2026**

---

## Language / 语言

- [中文简体](README.md) | [English](README.en.md)

---

## Overview

**Intelligent Palletizing Planning System (AUTOPLAN)** is an intelligent palletizing planning tool designed for Agilebot robots, providing automated workpiece placement calculation, robot program generation, and recipe management. The system supports intelligent planning for various workpiece shapes, automatically calculates optimal placement solutions, and directly communicates with robot controllers to automatically write planning data.

---
## Version Information

This extension is developed using SDK version PYTHON_v1.7.1.3. Please ensure your robot system environment is compatible with this version.

---

## Packaging Instructions

After development is complete, the extension needs to be packaged using the Agilebot extension packaging tool. For detailed packaging and installation instructions, please refer to:

[📦 Packaging and Installation Documentation](https://dev.sh-agilebot.com/docs/extension/zh/02-development/04-package.html)

---

## Feature Modules

The system provides the following 5 main feature modules:

### 1. Robot Settings
- **Robot Connection**: Connect to robot controller via IP address
- **Program Reading**: Read P-point data from specified robot program
- **Tool Configuration**: Set tool count, spacing, direction, layout, etc.
- **Coordinate System Settings**: Configure UF value, coordinate system direction, automatic TF calculation, etc.

### 2. Intelligent Planning
- **Frame Settings**: Configure frame length, width, depth
- **Workpiece Settings**: Support multiple workpiece types
  - Circular workpieces
  - Rectangular workpieces
  - Polygonal workpieces (5-8 sides)
  - Triangular workpieces (equilateral/isosceles)
- **Placement Settings**:
  - Horizontal/vertical spacing settings
  - Border distance settings
  - Material thickness settings
  - Placement layer settings
  - Layout type: Array/Honeycomb
  - Palletizing method: Row priority/Column priority
  - Remainder row/column rotation settings
- **Real-time Preview**: Automatically generate planning result preview, showing fillable quantity and single row/column quantity

### 3. Manual Planning
- **Grid Parameter Settings**: Set row count, column count, calculation method (row priority/column priority)
- **Reference Point Reading**: Read three reference points (PR1, PR2, PR3) from robot
- **Point Calculation**: Automatically calculate all grid point coordinates based on reference points
- **Data Generation**: Generate complete point data table

### 4. Data List
- **Data Display**: Display all planning point data in table format
  - Row/Column number
  - P-point ID
  - X/Y/C coordinate values
  - X/Y/C compensation values
- **Compensation Adjustment**:
  - Support compensation by row/column
  - Support angle compensation
  - Real-time compensation value update
- **Data Writing**: Write planning data to robot P-point program
- **Recipe Saving**: Save current planning parameters as recipe

### 5. Recipe Library
- **Recipe Management**:
  - Recipe list viewing
  - Recipe save/load
  - Recipe deletion
  - Recipe import/export
- **Recipe Calling**:
  - Call recipe by recipe number (MH register)
  - Support external call monitoring
  - Support automatic write function
- **Recipe Preview**: View detailed recipe parameters and preview image

---

## Core Features

### Intelligent Algorithms
- **Automatic Optimization**: Automatically calculate optimal placement solution to maximize frame utilization
- **Collision Detection**: Automatically detect workpiece boundaries to avoid exceeding frame range
- **Multiple Layouts**: Support both array and honeycomb layout methods
- **Flexible Configuration**: Support row priority/column priority palletizing methods

### Robot Integration
- **Real-time Communication**: Real-time communication with robot controller
- **Data Synchronization**: Automatically read and write robot program data
- **Register Operations**: Support PR, R, SR register read/write
- **Status Monitoring**: Real-time monitoring of robot connection status and running status

### Recipe System
- **Recipe Storage**: Local JSON format recipe data storage
- **Recipe Import/Export**: Support USB import/export recipes
- **Recipe Conflict Detection**: Automatically detect recipe number conflicts
- **Recipe Auto-assignment**: Automatically assign available recipe numbers

### Multi-language Support
- 中文简体 (Simplified Chinese)
- English
- Tiếng Việt (Vietnamese)
- 日本語 (Japanese)

---

## Usage Workflow

### Intelligent Planning Workflow

1. **Connect Robot**
   - Enter robot IP address on "Robot Settings" page
   - Click "Connect" button to establish connection
   - Enter program name, click "Read P-points" to get reference data

2. **Configure Tool Parameters**
   - Set Z&C reference register
   - Set UF value
   - Configure tool count, spacing, direction, layout, etc.

3. **Intelligent Planning**
   - Switch to "Intelligent Planning" page
   - Enter frame dimensions (length, width, depth)
   - Select workpiece type and enter dimension parameters
   - Set placement parameters (spacing, border distance, etc.)
   - Click "Calculate" to generate planning result
   - View preview image and fill quantity

4. **Data Adjustment**
   - Switch to "Data List" page
   - View all point data
   - If adjustment needed, enter row/column number and compensation value
   - Click "Update Compensation" to apply adjustment

5. **Write to Robot**
   - Enter program name
   - Click "Write P-points" to write data to robot
   - (Optional) Save as recipe for future use

### Manual Planning Workflow

1. **Connect Robot** (Same as Intelligent Planning step 1)

2. **Set Grid Parameters**
   - Switch to "Manual Planning" page
   - Enter row count, column count
   - Select calculation method (row priority/column priority)

3. **Read Reference Points**
   - Click "Read Reference Points" button
   - System automatically reads PR1, PR2, PR3 three reference points from robot

4. **Calculate Points**
   - Confirm reference point data is correct
   - Click "Calculate All Points" button
   - System automatically calculates all grid points

5. **Write to Robot** (Same as Intelligent Planning step 5)

---

## Important Notes

### Important Tips

1. **Robot Connection**:
   - Ensure robot controller and system running device are on the same network
   - Check IP address is correct before connecting
   - Check network connection and firewall settings if connection fails

2. **Data Backup**:
   - Recommend backing up original program before writing P-points
   - Recipe data stored in `data/` directory, recommend regular backup

3. **Parameter Settings**:
   - Frame dimensions must be larger than workpiece dimensions
   - Spacing and border distance must be positive values
   - Tool count must match actual tool count

4. **Recipe Management**:
   - Recipe number (ID) must be unique
   - System automatically detects and prompts for number conflicts
   - Confirm no longer needed before deleting recipe

5. **Coordinate System Settings**:
   - UF value range: 1-10
   - Tool coordinate system ID range: 1-30
   - Coordinate system direction: Right-hand/Left-hand coordinate system

6. **Manual Planning**:
   - Reference points (PR1, PR2, PR3) must be preset in robot
   - PR1: First row, first column
   - PR2: Last row, first column
   - PR3: First row, last column

---

## Version History

### v7.4.0 (January 16, 2026)
- Current stable version
- Support intelligent planning and manual planning
- Complete recipe management system
- Multi-language support
- External call monitoring function

---

**Agilebot Intelligent Palletizing Planning System | Version v7.4.0 | Updated: January 16, 2026 | © 2026**
